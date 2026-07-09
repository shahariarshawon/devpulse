import { pool } from "../../config/db";
import { AppError } from "../../utils/AppError";

interface CreateIssueData {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  reporter_id: number;
}

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
