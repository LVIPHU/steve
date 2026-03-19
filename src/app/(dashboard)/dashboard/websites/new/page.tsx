import { createWebsite } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewWebsitePage() {
  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-6">Tạo website mới</h1>
      <form action={createWebsite} className="space-y-4">
        <div>
          <Label htmlFor="name">Tên website</Label>
          <Input id="name" name="name" placeholder="Tên website" required />
        </div>
        <div>
          <Label htmlFor="promptText">Mô tả</Label>
          <Textarea
            id="promptText"
            name="promptText"
            placeholder="Mô tả app/website của bạn"
            rows={4}
            className="resize-none"
          />
        </div>
        <Button type="submit" className="w-full">Tạo ngay</Button>
      </form>
    </div>
  );
}
