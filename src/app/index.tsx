import { FlatList } from 'react-native';
import { meditations } from "@/data";
import {MeditationListItem} from "@/components/MeditationListItem";



export default function HomeScreen() {
    return (
      <FlatList
          data={meditations}
          className= "bg-white"
          contentContainerClassName="gap-8 p-3"
          renderItem={({item}) => <MeditationListItem meditation={item} />}
      />
    );

}