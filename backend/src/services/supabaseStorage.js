const { randomUUID } = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const requiredEnvVars = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];

const getMissingEnvVars = () => {
  return requiredEnvVars.filter((key) => !process.env[key]);
};

const getClient = () => {
  const missing = getMissingEnvVars();
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno de Supabase: ${missing.join(", ")}`);
  }

  const supabaseUrl = String(process.env.SUPABASE_URL || "").trim();
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (supabaseUrl.includes("your-project-ref") || serviceRoleKey === "your_service_role_key") {
    throw new Error(
      "Configuracion de Supabase incompleta: reemplaza SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY con valores reales"
    );
  }

  if (!/^https:\/\/.+\.supabase\.co$/i.test(supabaseUrl)) {
    throw new Error("SUPABASE_URL invalida. Debe ser como: https://<project-ref>.supabase.co");
  }

  return createClient(supabaseUrl, serviceRoleKey);
};

const getBucketName = () => process.env.SUPABASE_STORAGE_BUCKET || "car-images";

const sanitizeFileName = (name) => {
  return String(name || "image")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
};

const uploadCarImage = async (file) => {
  if (!file) {
    return null;
  }

  const supabase = getClient();
  const bucket = getBucketName();
  const safeName = sanitizeFileName(file.originalname);
  const filePath = `cars/${Date.now()}-${randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
      cacheControl: "3600"
    });

  if (uploadError) {
    throw new Error(`No se pudo subir la imagen a Supabase: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  if (!data || !data.publicUrl) {
    throw new Error("No se pudo generar la URL publica de la imagen");
  }

  return data.publicUrl;
};

module.exports = {
  uploadCarImage
};
