import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FootAnalysisForm, { FormData } from './FootAnalysisForm';
import ShoeCard from "@/components/foot-analysis/ShoeCard";

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

export default function FootAnalysisResult() {
    const [showResults, setShowResults] = useState(false);
    const [formData, setFormData] = useState<FormData | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            setShowResults(false);
            setFormData(null);
        }, [])
    );

    const handleSubmit = (data: FormData) => {
        console.log('Submitted form data:', data);
        setFormData(data);
        setShowResults(true);
    };

    const handleReset = () => {
        setShowResults(false);
        setFormData(null);
    };

    if (showResults && formData) {
        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.cardsContainer}>
                        {dummyResults.map((shoe) => (
                            <ShoeCard
                                key={shoe.id}
                                modelName={shoe.modelName}
                                size={shoe.size}
                                productUrl={shoe.productUrl}
                                imageUrl={shoe.imageUrl}
                            />
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleReset}
                    >
                        <Text style={styles.submitButtonText}>다시 검색하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <FootAnalysisForm onSubmit={handleSubmit} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    cardsContainer: {
        padding: 20,
        paddingBottom: 0,
    },
    buttonContainer: {
        padding: 20,
        backgroundColor: 'white',
    },
    submitButton: {
        backgroundColor: '#735BF2',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
