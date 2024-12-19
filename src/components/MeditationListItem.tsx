import {Text, View} from "react-native";
import { Meditation } from "@/types";


export function MeditationListItem({meditation}: {meditation: Meditation}) {

    return(
        <View className="p-5 border border-gray-300 rounded-2xl">
            <Text className="font-semibold text-xl" >
                {meditation.title}
            </Text>
        </View>
    );
}
