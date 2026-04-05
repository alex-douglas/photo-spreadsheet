import { getSupabaseAdmin } from "@/lib/supabase/admin";

interface UploadEvent {
  doc_type: string;
  mime_type: string;
  page_count: number;
  credit_cost: number;
}

/**
 * Fire-and-forget: logs an upload event to the upload_events table.
 * Never throws — failures are swallowed so they don't affect the user flow.
 */
export function logUploadEvent(event: UploadEvent): void {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  supabase
    .from("upload_events")
    .insert({
      doc_type: event.doc_type,
      mime_type: event.mime_type,
      page_count: event.page_count,
      credit_cost: event.credit_cost,
    })
    .then(({ error }) => {
      if (error) console.warn("[upload-events] insert failed", error);
    });
}
