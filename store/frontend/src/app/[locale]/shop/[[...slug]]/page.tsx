import { CategoryPage } from "@/features/shop/components/category-page";

export default async function ShopCategoryPage(props: PageProps<"/[locale]/shop/[[...slug]]">) {
    const [{ slug = [] }, searchParams] = await Promise.all([props.params, props.searchParams]);

    return (
        <div className="container-page pt-4 sm:pt-6">
            <CategoryPage slugs={slug} searchParams={searchParams} />
        </div>
    );
}