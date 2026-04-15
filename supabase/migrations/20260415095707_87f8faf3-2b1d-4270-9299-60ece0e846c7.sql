
CREATE POLICY "Allow reading contact submissions"
ON public.contact_submissions
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow reading table bookings"
ON public.table_bookings
FOR SELECT
TO anon, authenticated
USING (true);
