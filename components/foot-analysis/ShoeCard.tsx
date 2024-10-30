import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';

type ShoeData = {
    modelName: {
        ko: string;
        en: string;
    };
    size: string;
    productUrl: string;
    imageUrl: string;
};

const dummyShoes: ShoeData[] = [
    {
        modelName: {
            ko: "스카르파 인스팅트 VS 여성용",
            en: "SCARPA INSTINCT VS WOMEN'S"
        },
        size: "EU 42",
        productUrl: "https://rockrun.com/ko/collections/climbing-shoes/products/scarpa-instinct-vs-womens?variant=15957440462942",
        imageUrl: "https://cdn.shopify.com/s/files/1/0604/5140/0302/products/scarpa-instinct-vs-womens-climbing-shoes_1.jpg"
    }
];

export default function ShoeCard({ modelName, size, productUrl, imageUrl }: ShoeData) {
    const openLink = () => {
        Linking.openURL(productUrl).catch(err => console.error("Failed to open URL:", err));
    };

    return (
        <TouchableOpacity onPress={openLink} style={styles.card}>
            <Image
                source={{ uri: imageUrl }}
                style={styles.shoeImage}
                resizeMode="contain"
            />
            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <View style={styles.modelNameContainer}>
                        <Text style={styles.modelName}>{modelName.ko}</Text>
                        <Text style={styles.modelNameEn}>{modelName.en}</Text>
                    </View>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>추천 사이즈 :</Text>
                    <Text style={styles.value}>{size}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    shoeImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#F8F9FC',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    label: {
        width: 80,
        fontSize: 14,
        color: '#1A1F36',
        fontWeight: '500',
    },
    modelNameContainer: {
        flex: 1,
    },
    modelName: {
        fontSize: 14,
        color: '#1A1F36',
        marginBottom: 4,
    },
    modelNameEn: {
        fontSize: 14,
        color: '#1A1F36',
        fontWeight: '600',
    },
    value: {
        fontSize: 14,
        color: '#1A1F36',
    },
});

