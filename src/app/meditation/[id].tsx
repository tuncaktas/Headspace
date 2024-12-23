import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from "expo-router";
import { meditations } from "@/data";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import audioFile from '@assets/meditations/audio.mp3';
import AnimatedBackground from "@/components/AnimatedBackground";


export default function MeditationDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const meditation = meditations.find((m) => m.id === Number(id));

    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    // Helper function to format the duration
    const formatTime = (milliseconds: number) => {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Sound playback control
    const playAudio = async () => {
        try {
            if (!sound) {
                const { sound: newSound } = await Audio.Sound.createAsync(audioFile, {}, (status) => {
                    if (status.isLoaded) {
                        setPosition(status.positionMillis || 0);
                        setDuration(status.durationMillis || 0);
                    }
                });
                setSound(newSound);
                await newSound.playAsync();
                setIsPlaying(true);
            } else {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            }
        } catch (error) {
            console.error("Audio oynatma hatası:", error);
        }
    };

    // Slider control: Adjust the position when the user scrolls
    const handleSlidingComplete = async (value: number) => {
        if (sound) {
            const newPosition = value * duration;
            await sound.setPositionAsync(newPosition);
            setPosition(newPosition);
        }
    };

    // Sound status is constantly checked (position and duration are updated)
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (sound && isPlaying) {
            interval = setInterval(async () => {
                const status = await sound.getStatusAsync();
                if (status.isLoaded) {
                    setPosition(status.positionMillis || 0);
                    setDuration(status.durationMillis || 0);
                }
            }, 1000); // Update every 1 second
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [sound, isPlaying]);

    // Release the audio source when the component is unmounted
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    if (!meditation) {
        return <Text>{`No meditation found`}</Text>;
    }

    return (
        <SafeAreaView className="bg-orange-400 flex-1 p-2 justify-between">
            <AnimatedBackground />
            <View className="flex-1">
                {/* Header */}
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

                {/* Play/Pause Button */}
                <Pressable
                    onPress={playAudio}
                    className="bg-zinc-800 self-center w-20 aspect-square items-center justify-center rounded-full"
                >
                    <FontAwesome6
                        name={isPlaying ? "pause" : "play"}
                        size={24}
                        color="snow"
                    />
                </Pressable>

                {/* Bottom part of the screen */}
                <View className="flex-1">
                    {/* Footer: Player */}
                    <View className="p-5 mt-auto gap-5">
                        <View className="flex-row justify-between">
                            <MaterialIcons name="airplay" size={24} color="#3A3937" />
                            <MaterialCommunityIcons name="cog-outline" size={24} color="#3A3937" />
                        </View>
                        {/* Playback Indicator */}
                        <View>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                value={duration ? position / duration : 0}
                                onSlidingComplete={handleSlidingComplete}
                                minimumValue={0}
                                maximumValue={1}
                                minimumTrackTintColor="#3A3937"
                                maximumTrackTintColor="#3A393755"
                                thumbTintColor="#3A3937"
                            />
                        </View>
                        <View className="flex-row justify-between">
                            <Text>{formatTime(position)}</Text>
                            <Text>{formatTime(duration)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}