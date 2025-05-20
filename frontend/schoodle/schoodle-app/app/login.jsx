import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';



/**
 * @component login
 * @description A login screen component with email and password inputs.
 *
 *
 * @returns {SafeAreaView} A SafeAreaView containing the login form.
 */
export function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateSubmit = () => {
        let isValid = true;

        // Validar email
        if (!email.trim()) {
            setEmailError('El email es obligatorio');
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError('Ingresa un email válido');
            isValid = false;
        } else {
            setEmailError('');
        }

        // Validar contraseña
        if (!password.trim()) {
            setPasswordError('La contraseña es obligatoria');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Mínimo 6 caracteres');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleLogin = () => {
        if (validateSubmit()) {
            router.push('/home');
        } else {
            Alert.alert('Error', 'Por favor completa todos los campos correctamente');
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <Text style={styles.appName}>Schoodle</Text>
                    <Text style={styles.tagline}>login</Text>
                </View>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="ejemplo@dominio.com"
                    placeholderTextColor={Colors.background}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="••••••"
                    placeholderTextColor={Colors.background}
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: 40,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        paddingTop: 20,
        paddingBottom: 30,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.text,
    },
    tagline: {
        fontSize: 18,
        color: Colors.text,
    },
    loginText: {
        color: Colors.text || '#000000',
        fontSize: 16,
        marginLeft: 30,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 60,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        marginTop: 20,
        color: Colors.text || '#000000',
    },
    input: {
        backgroundColor: '#A9C7E7',
        borderRadius: 20,
        height: 50,
        marginBottom: 4,
        paddingHorizontal: 15,
        color: Colors.text,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 16,
        marginTop: -4,
        paddingLeft: 15,
    },
    button: {
        backgroundColor: Colors.yellowButton,
        borderRadius: 20,
        height: 40,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: '50%',
        alignSelf: 'center',
    },
    buttonText: {
        color: Colors.text || '#000000',
        fontSize: 16,
        fontWeight: '500',
    },
});

