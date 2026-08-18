import Link from "next/link";
import { redirect } from "next/navigation";
import { Archive, PackagePlus, Plus, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import { createProduct, toggleProductStatus } from "./actions";

export const metadata = {
  title: "Products | MediDove Admin",
};

type ProductRow = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock_status: string;
  requires_prescription: boolean;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin");
  }

  const { data } = await supabase
    .from("products")
    .select(
      "id, name, category, description, price, stock_status, requires_prescription, is_featured, is_active, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(40);

  const products = (data || []) as ProductRow[];
  const activeCount = products.filter((item) => item.is_active).length;
  const reviewCount = products.filter((item) => item.requires_prescription).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              Product catalog
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
              Manage wellness product inquiries
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Publish non-prescription products and route patient interest to
              staff review instead of direct regulated checkout.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/shop">View shop</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Total products</CardDescription>
                <CardTitle className="mt-2 text-3xl">
                  {products.length}
                </CardTitle>
              </div>
              <PackagePlus className="size-8 text-primary" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Active</CardDescription>
                <CardTitle className="mt-2 text-3xl">{activeCount}</CardTitle>
              </div>
              <Archive className="size-8 text-emerald-600" />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription>Needs review</CardDescription>
                <CardTitle className="mt-2 text-3xl">{reviewCount}</CardTitle>
              </div>
              <ShieldAlert className="size-8 text-amber-500" />
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Card>
            <CardHeader>
              <CardDescription>New item</CardDescription>
              <CardTitle>Create product</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createProduct} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Product name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Digital Blood Pressure Monitor"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" placeholder="Home monitoring" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" name="price" type="number" min="0" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stock_status">Stock status</Label>
                    <Input
                      id="stock_status"
                      name="stock_status"
                      placeholder="available"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      placeholder="/assets/img/shop/img1.jpg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={5}
                    placeholder="Safe product description for staff-reviewed inquiries."
                  />
                </div>
                <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  <input
                    name="requires_prescription"
                    type="checkbox"
                    className="mt-1 size-4 rounded border-slate-300"
                  />
                  Requires prescription or clinical review
                </label>
                <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  <input
                    name="is_featured"
                    type="checkbox"
                    className="mt-1 size-4 rounded border-slate-300"
                  />
                  Feature this product
                </label>
                <Button type="submit">
                  <Plus />
                  Save product
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {products.length > 0 ? (
              products.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <CardDescription>{item.category}</CardDescription>
                        <CardTitle className="mt-2 text-xl">
                          {item.name}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{formatPrice(Number(item.price))}</Badge>
                        <Badge variant={item.is_active ? "secondary" : "outline"}>
                          {item.is_active ? "Active" : "Archived"}
                        </Badge>
                        {item.requires_prescription ? (
                          <Badge variant="outline">Review required</Badge>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="secondary">{item.stock_status}</Badge>
                      {item.is_featured ? (
                        <Badge variant="outline">Featured</Badge>
                      ) : null}
                      <form action={toggleProductStatus}>
                        <input type="hidden" name="id" value={item.id} />
                        <input
                          type="hidden"
                          name="active"
                          value={String(!item.is_active)}
                        />
                        <Button type="submit" variant="outline" size="sm">
                          {item.is_active ? "Archive" : "Activate"}
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-14 text-center text-slate-500">
                  <PackagePlus className="mx-auto mb-3 size-9" />
                  No products yet.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
