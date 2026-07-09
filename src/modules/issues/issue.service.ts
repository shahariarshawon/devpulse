import { pool } from "../../config/db";
import { AppError } from "../../utils/AppError";

interface CreateIssueData {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  reporter_id: number;
}
interface GetIssuesQuery {
  sort?: "newest" | "oldest";
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
}

export const getAllIssues = async (query: GetIssuesQuery) => {
  const { sort = "newest", type, status } = query;

  let sql = `
        SELECT *
        FROM issues
    `;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (type) {
    values.push(type);

    conditions.push(`type=$${values.length}`);
  }

  if (status) {
    values.push(status);

    conditions.push(`status=$${values.length}`);
  }

  if (conditions.length > 0) {
    sql += `
        WHERE ${conditions.join(" AND ")}
        `;
  }

  if (sort === "oldest") {
    sql += `
        ORDER BY created_at ASC
        `;
  } else {
    sql += `
        ORDER BY created_at DESC
        `;
  }

  const issueResult = await pool.query(sql, values);

  const issues = issueResult.rows;

  if (issues.length === 0) {
    return [];
  }

  // Fetch reporters without JOIN

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const userResult = await pool.query(
    `
        SELECT
        id,
        name,
        role
        FROM users
        WHERE id = ANY($1)
        `,

    [reporterIds],
  );

  const reporters = userResult.rows;

  const finalIssues = issues.map((issue) => {
    const reporter = reporters.find((user) => user.id === issue.reporter_id);

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,

      reporter,

      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });

  return finalIssues;
};
export const createIssue = async (data: CreateIssueData) => {
  const { title, description, type, reporter_id } = data;

  const result = await pool.query(
    `
        INSERT INTO issues
        (
            title,
            description,
            type,
            reporter_id
        )

        VALUES
        ($1,$2,$3,$4)

        RETURNING *
        `,

    [title, description, type, reporter_id],
  );

  return result.rows[0];
};

export const getSingleIssue = async (id: number) => {
  const issueResult = await pool.query(
    `
        SELECT *
        FROM issues
        WHERE id=$1
        `,
    [id],
  );

  if (issueResult.rows.length === 0) {
    throw new AppError(404, "Issue not found");
  }

  const issue = issueResult.rows[0];

  const userResult = await pool.query(
    `
        SELECT
        id,
        name,
        role
        FROM users
        WHERE id=$1
        `,
    [issue.reporter_id],
  );

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,

    reporter: userResult.rows[0],

    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

interface UpdateIssueData {
  title?: string;
  description?: string;
  type?: string;
}

export const updateIssue = async (
  id: number,
  data: UpdateIssueData,
  user: {
    id: number;
    role: string;
  },
) => {
  const issueResult = await pool.query(
    `
SELECT *
FROM issues
WHERE id=$1
`,
    [id],
  );

  if (issueResult.rows.length === 0) {
    throw new AppError(404, "Issue not found");
  }

  const issue = issueResult.rows[0];

  // Permission check

  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      throw new AppError(403, "You can update only your own issue");
    }

    if (issue.status !== "open") {
      throw new AppError(409, "Cannot update resolved or in progress issue");
    }
  }

  // Update

  const result = await pool.query(
    `
UPDATE issues

SET

title=COALESCE($1,title),
description=COALESCE($2,description),
type=COALESCE($3,type)

WHERE id=$4

RETURNING *
`,

    [data.title, data.description, data.type, id],
  );

  return result.rows[0];
};

export const deleteIssue = async (id: number, userRole: string) => {
  if (userRole !== "maintainer") {
    throw new AppError(403, "Only maintainer can delete issue");
  }

  const result = await pool.query(
    `
DELETE FROM issues
WHERE id=$1
RETURNING id
`,

    [id],
  );

  if (result.rows.length === 0) {
    throw new AppError(404, "Issue not found");
  }

  return true;
};
