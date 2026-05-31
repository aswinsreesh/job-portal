INSERT INTO categories (name, slug) VALUES
  ('Engineering', 'engineering'),
  ('Design', 'design'),
  ('Marketing', 'marketing'),
  ('Sales', 'sales'),
  ('Product', 'product'),
  ('Operations', 'operations'),
  ('Human Resources', 'human-resources'),
  ('Finance', 'finance')
ON CONFLICT (slug) DO NOTHING;
