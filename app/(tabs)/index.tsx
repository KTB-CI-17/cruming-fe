import { Redirect } from 'expo-router';
import {SafeAreaView} from "react-native-safe-area-context";
import {Text} from "react-native";
import React from "react";

export default function Index() {
    return (
        <SafeAreaView>
            <Text>home 탭</Text>
        </SafeAreaView>
    )
}
