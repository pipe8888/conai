import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://aczzpvxafvfrrkqlrtxr.supabase.co',
  import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_mIVFZur0OvAhmwUTB7kmRw_cwCKfC0Y'
)
