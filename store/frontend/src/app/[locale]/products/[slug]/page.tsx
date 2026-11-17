import { ProductDetail } from "@/features/shop/components/product-detail";

export default async function ProductPage(props: PageProps<"/[locale]/products/[slug]">) {
    const { slug } = await props.params;

    return (
        <div className="container-page pt-4 sm:pt-6">
            <ProductDetail slug={slug} />
        </div>
    );
}