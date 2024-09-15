import React from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
} from "react-native";
import {Picker} from '@react-native-picker/picker'
import { useForm, Controller } from "react-hook-form";

export default function UserFormCare({ navigation }) {
    const { control, handleSubmit } = useForm();

    const onSubmit = (data) => console.log(data);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name</Text>
            <Controller
                control={control}
                name="Name"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Enter your name"
                    />
                )}
            />

            <Text style={styles.label}>Gender</Text>
            <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Picker
                        selectedValue={value}
                        style={styles.picker}
                        onValueChange={(itemValue) => onChange(itemValue)}
                    >
                        <Picker.Item label="Female" value="female" />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Other" value="other" />
                    </Picker>
                )}
            />

            <Text style={styles.label}>Age</Text>
            <Controller
                control={control}
                name="Age"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Enter your age"
                        keyboardType="numeric"
                    />
                )}
            />

            <Text style={styles.label}>Location</Text>
            <Controller
                control={control}
                name="Location"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Enter your location"
                    />
                )}
            />


            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 12,
    },
});




