-- DropForeignKey
ALTER TABLE "scene_links" DROP CONSTRAINT "scene_links_from_scene_id_fkey";

-- DropForeignKey
ALTER TABLE "scene_links" DROP CONSTRAINT "scene_links_to_scene_id_fkey";

-- AddForeignKey
ALTER TABLE "scene_links" ADD CONSTRAINT "scene_links_from_scene_id_fkey" FOREIGN KEY ("from_scene_id") REFERENCES "scenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_links" ADD CONSTRAINT "scene_links_to_scene_id_fkey" FOREIGN KEY ("to_scene_id") REFERENCES "scenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
