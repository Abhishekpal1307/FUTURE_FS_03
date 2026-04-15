-- Add status column to table_bookings
ALTER TABLE public.table_bookings 
ADD COLUMN status text NOT NULL DEFAULT 'pending';

-- Allow updating table bookings (for admin approve/reject)
CREATE POLICY "Allow updating table bookings"
ON public.table_bookings
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);