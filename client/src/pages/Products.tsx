import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/productService";
import type { Product } from "@/lib/productService";

export default function Products() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    taxCategory: "18", // Default GST
    unit: "Item",
    description: "",
    isActive: true,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      price: "",
      taxCategory: "18",
      unit: "Item",
      description: "",
      isActive: true,
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku || "",
      price: product.price.toString(),
      taxCategory: product.taxCategory || "18",
      unit: product.unit || "Item",
      description: product.description || "",
      isActive: product.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
    };
    
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="flex-1 p-8 flex flex-col gap-6 max-h-screen overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Products & Services</h2>
          <p className="text-slate-500">Manage the items you sell to quickly add them to invoices.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? "Make changes to your product here." : "Add a new product or service to your catalog."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product/Service Name</Label>
                  <Input 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input 
                      id="price" 
                      type="number"
                      step="0.01"
                      required 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taxCategory">Tax Rate (%)</Label>
                    <Input 
                      id="taxCategory" 
                      type="number"
                      value={formData.taxCategory}
                      onChange={(e) => setFormData({...formData, taxCategory: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input 
                    id="description" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input placeholder="Search products..." className="pl-8 bg-white" />
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0">
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Tax Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Package className="h-8 w-8 mb-2 text-slate-300" />
                    <p>No products found in your catalog.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-slate-900">{product.name}</TableCell>
                  <TableCell className="text-slate-500 truncate max-w-[200px]">{product.description || "-"}</TableCell>
                  <TableCell>₹{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.taxCategory}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Pencil className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if(confirm("Are you sure you want to delete this product?")) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
