import { Suspense } from "react";
import BannerSection, { BannerSectionFallback } from "./BannerSection";
import CategorySection, { CategorySectionFallback } from "./CategorySection";

export default function ListingSection({ bannerData, categoryList }) {

  return (
    <section>
      {/* Banner/Hero Section  */}
      <div>
        <Suspense fallback={<BannerSectionFallback />}>
          <BannerSection bannerData={bannerData} />
        </Suspense>
      </div>

      {/* Category Section */}
      {categoryList.map((vid, index) => (
        <Suspense key={index} fallback={<CategorySectionFallback />}>
          <div key={index} className="py-6 px-6">
            <CategorySection
              label={vid.label}
              fetcher={vid.fetcher}
            />
          </div>
        </Suspense>
      ))}
    </section>
  );
}

