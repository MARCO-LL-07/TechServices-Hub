import { createClient } from "@supabase/supabase-js";

let supabaseClient;

const getSupabaseConfig = () => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey =
    process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;
  const bucket = process.env.REACT_APP_SUPABASE_STORAGE_BUCKET || "car-images";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Falta configurar REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY (o REACT_APP_SUPABASE_PUBLISHABLE_KEY)"
    );
  }

  return { supabaseUrl, supabaseKey, bucket };
};

const getSupabaseClient = () => {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseKey } = getSupabaseConfig();
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
};

const sanitizeFileName = (name) => {
  return String(name || "image")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
};

export const uploadPublicCarImage = async (file) => {
  if (!file) return "";

  const { bucket } = getSupabaseConfig();
  const supabase = getSupabaseClient();
  const objectPath = `cars/${Date.now()}-${sanitizeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream"
  });

  if (uploadError) {
    throw new Error(`No se pudo subir imagen a Storage: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  if (!data?.publicUrl) {
    throw new Error("No se pudo obtener URL publica de la imagen");
  }

  return data.publicUrl;
};
