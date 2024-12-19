import {Pressable, Text, View,} from 'react-native'
import {router, useLocalSearchParams} from "expo-router";
import {meditations} from "@/data";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import {SafeAreaView} from 'react-native-safe-area-context';



export default function MeditationDetails() {
    const { id } = useLocalSearchParams<{ id: string}>();
    const meditation = meditations.find((m) => m.id === Number(id));


    if (!meditation) {
        return <Text>{`No meditation found`}</Text>;
    }

    return (

        <SafeAreaView className="bg-orange-400 flex-1 p-2 justify-between">
            {/* Page Content */}
            <View className="flex-1">
                {/*Header */}
                <View className="flex-1">
                    <View className="flex-row items-center justify-between p-10">
                        <AntDesign name="infocirlceo" size={24} color="black" />
                        <View className="bg-zinc-700 p-2 rounded-md">
                            <Text className="text-zinc-100 font-semibold">Today's Meditation</Text>
                        </View>
                        <AntDesign
                            onPress={() => router.back()}
                            name="close"
                            size={24}
                            color="black"
                        />
                    </View>
                    <Text className="text-3xl mt-20 text-center text-zinc-800 font-semibold">
                        {meditation?.title}
                    </Text>
                </View>

                {/* Play/Pause Button*/}

                <Pressable className="bg-zinc-800 self-center w-20 aspect-square items-center justify-center rounded-full">
                    <FontAwesome6 name="play" size={24} color="snow" />
                </Pressable>

                {/* Bottom part of the screen */}
                <View className="flex-1">
                    {/* Footer: Player */}
                    <View className="p-5 mt-auto gap-5">
                        <View className="flex-row justify-between">
                            <MaterialIcons name="airplay" size={24} color="#3A3937" />
                            <MaterialCommunityIcons name="cog-outline" size={24} color="#3A3937" />
                        </View>
                        {/* Playback Indicator*/}
                        <View>
                            <Slider
                                style={{width: '100%', height: 40}}
                                value={0.5}
                                onSlidingComplete={(value) => console.log(value)}
                                minimumValue={0}
                                maximumValue={1}
                                minimumTrackTintColor="#3A3937"
                                maximumTrackTintColor="#3A393755"
                                thumbTintColor="#3A3937"
                            />
                        </View>
                        <View className="flex-row justify-between">
                           <Text>03:24</Text>
                           <Text>13:14</Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
