import {StyleSheet, Text, View} from 'react-native';
import CustomHeader from "@/components/CustomHeader";
import {useAppSelector} from "@/store/store";

export default function TemplatesScreen() {
    const { backgroundColor} = useAppSelector((state: any): any => state.theme);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <CustomHeader title="Settings" />

            <View style={styles.content}>
                <Text style={styles.text}>Your Settings Go Here</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 18
    }
});