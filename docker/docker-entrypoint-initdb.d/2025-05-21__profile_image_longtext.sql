-- Migration: Make profile_image column LONGTEXT for large base64 images
ALTER TABLE UserLoginDetails MODIFY profile_image LONGTEXT;
