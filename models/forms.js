import { Model } from "@nozbe/watermelondb";
import { field, text, date } from "@nozbe/watermelondb/decorators";

export default class Forms extends Model {
  static table = "forms";

  @field("form_id") formId;
  @field("form_title") formTitle;
  @text("form_data") formData; // Store JSON string
  @field("input_number") input_number;
  @field("latitude") latitude;
  @field("longitude") longitude;
  @date("created_at") createdAt;
  @date("updated_at") updatedAt;
}
