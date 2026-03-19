import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <section className="py-24 text-center">
          <h1
            className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6"
            style={{
              animation: "fadeInUp 0.4s ease both",
              animationDelay: "0s",
            }}
          >
            Biến ghi chú thành website trong vài giây
          </h1>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
            style={{
              animation: "fadeInUp 0.4s ease both",
              animationDelay: "0.1s",
            }}
          >
            Mô tả app của bạn, AI sẽ tạo ra một website hoàn chỉnh — không cần code.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            style={{
              animation: "fadeInUp 0.4s ease both",
              animationDelay: "0.2s",
            }}
          >
            <Button asChild>
              <Link href="/register">Bắt đầu miễn phí</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Tại sao chọn AppGen?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-border p-6 hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold mb-2">AI tạo website</h3>
              <p className="text-sm text-muted-foreground">
                Mô tả ý tưởng, AI sẽ tạo website hoàn chỉnh với HTML, CSS và JavaScript.
              </p>
            </div>
            <div className="rounded-xl border border-border p-6 hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold mb-2">Chỉnh sửa trực quan</h3>
              <p className="text-sm text-muted-foreground">
                Giao diện editor giống Lovable — xem trước trực tiếp và chỉnh sửa bằng chat.
              </p>
            </div>
            <div className="rounded-xl border border-border p-6 hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold mb-2">Xuất bản tức thì</h3>
              <p className="text-sm text-muted-foreground">
                Một click để website của bạn có URL công khai, sẵn sàng chia sẻ.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Cách hoạt động
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center mx-auto mb-4 text-sm">
                1
              </div>
              <h3 className="font-semibold mb-2">Mô tả website</h3>
              <p className="text-sm text-muted-foreground">
                Nhập mô tả ngắn về website bạn muốn tạo.
              </p>
            </div>
            <div className="p-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center mx-auto mb-4 text-sm">
                2
              </div>
              <h3 className="font-semibold mb-2">AI tạo nội dung</h3>
              <p className="text-sm text-muted-foreground">
                AI tự động sinh ra website hoàn chỉnh trong vài giây.
              </p>
            </div>
            <div className="p-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center mx-auto mb-4 text-sm">
                3
              </div>
              <h3 className="font-semibold mb-2">Xuất bản và chia sẻ</h3>
              <p className="text-sm text-muted-foreground">
                Xuất bản một click — nhận ngay URL công khai để chia sẻ.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 text-center text-sm text-muted-foreground border-t border-border">
          AppGen — Tạo website bằng AI &copy; {new Date().getFullYear()}
        </footer>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
