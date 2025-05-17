import { TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import PropTypes from 'prop-types';
import { Colors } from '../constants/Colors';

const NotificationButton = ({ hasNotification = false }) => {
    return (
        <Link href="/notification" asChild>
            <TouchableOpacity style={styles.button}>
                <View style={styles.container}>
                    <Image
                        source={require('../assets/images/ic_notifications.png')}
                        style={styles.icon}
                    />
                    {hasNotification && <View style={styles.notificationDot} />}
                </View>
            </TouchableOpacity>
        </Link>
    );
};

NotificationButton.propTypes = {
    hasNotification: PropTypes.bool,
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: 30,
        height: 30,
        backgroundColor: Colors.babyBlue,
        borderRadius: 30,
        padding: 3
    },
    icon: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    notificationDot: {
        position: 'absolute',
        top: -1,
        right: -1,
        backgroundColor: Colors.notificationRed,
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});

export default NotificationButton;