import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import FootAnalysisForm from './FootAnalysisForm';
import ShoeCard from "@/app/page/foot-analysis/ShoeCard";

type ShoeData = {
    id: number;
    modelName: {
        ko: string;
        en: string;
    };
    size: string;
    productUrl: string;
    imageUrl: string;
};

const dummyResults: ShoeData[] = [
    {
        id: 1,
        modelName: {
            ko: "스카르파 인스팅트 VS 여성용",
            en: "SCARPA INSTINCT VS WOMEN'S"
        },
        size: "EU 42",
        productUrl: "https://rockrun.com/ko/collections/climbing-shoes/products/scarpa-instinct-vs-womens?variant=15957440462942",
        imageUrl: "https://rockrun.com/cdn/shop/products/scarpa-instinct-vs-womens_600x.png?v=1671190209"
    },
    {
        id: 2,
        modelName: {
            ko: "스카르파 드라고 LV 암벽화",
            en: "SCARPA DRAGO LV"
        },
        size: "EU 41",
        productUrl: "https://rockrun.com/ko/collections/climbing-shoes/products/scarpa-drago-lv",
        imageUrl: "https://rockrun.com/cdn/shop/products/scarpa-instinct-vs-womens_600x.png?v=1671190209"
    },
    {
        id: 3,
        modelName: {
            ko: "라스포티바 솔루션 컴프 여성용",
            en: "LA SPORTIVA SOLUTION COMP WOMEN'S"
        },
        size: "EU 40.5",
        productUrl: "https://rockrun.com/ko/collections/climbing-shoes/products/la-sportiva-solution-comp-womens",
        imageUrl: "https://rockrun.com/cdn/shop/products/scarpa-instinct-vs-womens_600x.png?v=1671190209"
    },
];

export default function FootAnalysisPage() {
    const [showResults, setShowResults] = useState(false);

    const handleSubmit = () => {
        setShowResults(true);
    };

    if (showResults) {
        return (
            <ScrollView style={styles.container}>
                {dummyResults.map((shoe) => (
                    <ShoeCard
                        key={shoe.id}
                        modelName={shoe.modelName}
                        size={shoe.size}
                        productUrl={shoe.productUrl}
                        imageUrl={shoe.imageUrl}
                    />
                ))}
            </ScrollView>
        );
    }

    return (
        <FootAnalysisForm onSubmit={handleSubmit} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});
