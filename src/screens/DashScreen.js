import React, { useState, useContext, useEffect, useRef } from 'react';
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	Image,
	TouchableOpacity,
	TouchableHighlight,
	FlatList,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { Context as ChannelContext } from '../context/ChannelContext';
import SocketContext from '../context/SocketContext';
import AvatarPicker from '../components/AvatarPicker';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import UserAvatar from '../components/UserAvatar';
import UserSearchItem from '../components/UserSearchItem';
import FriendsList from '../components/FriendsList';
import UserSearchList from '../components/UserSearchList';
import PendingList from '../components/PendingList';
import BlockedList from '../components/BlockedList';
import WhiteText from '../components/WhiteText';

const DashScreen = ({ navigation }) => {
	const listRef = useRef();
	const { addFriend, unblock, state } = useContext(ChannelContext);
	const socket = useContext(SocketContext);
	const [userSearch, setUserSearch] = useState('');
	const [menuIndex, setMenuIndex] = useState(0);

	const handleClick = () => {
		// showForm({ show: 'edit_user' });
	};

	const cancelForm = () => {
		// showForm(false);
		navigation.navigate('channelFlow');
	};

	const handleChangeText = e => {
		setUserSearch(e.target);
		console.log('UserSearch being emitted', userSearch);
		socket.emit('searchuser', userSearch);
		console.log('socket emitting search');
	};

	const handleMenuClick = index => {
		setMenuIndex(index);
		listRef.current.scrollToIndex({ animated: true, index: index });
	};

	const dashMenus = [
		{ name: 'search', comp: <UserSearchList user={state.currentUser} /> },
		{ name: 'friends', comp: <FriendsList user={state.currentUser} /> },
		{ name: 'pending', comp: <PendingList user={state.currentUser} /> },
		{ name: 'blocked', comp: <BlockedList user={state.currentUser} /> },
	];

	function onScrollEnd(e) {
		let contentOffset = e.nativeEvent.contentOffset;
		let viewSize = e.nativeEvent.layoutMeasurement;

		// Divide the horizontal offset by the width of the view to see which page is visible
		let pageNum = Math.round(contentOffset.x / viewSize.width);
		// console.log('scrolled to page ', pageNum);
		setMenuIndex(pageNum);
	}

	return (
		<View style={styles.container}>
			<View style={styles.userBox}>
				<UserAvatar avatar={state.currentUser.avatar} handleClick={handleClick} />
				<WhiteText>{state.currentUser.username}</WhiteText>
				<WhiteText>Account created on {state.currentUser.createdAt}</WhiteText>
				<WhiteText>Messages Sent: {state.currentUser.msgsSent}</WhiteText>
			</View>
			<View style={styles.menuContainer}>
				{dashMenus.map((menu, index) => (
					<Button
						key={index}
						title={menu.name}
						type={menuIndex === index ? 'solid' : 'outline'}
						containerStyle={styles.menu}
						onPress={() => handleMenuClick(index)}
					/>
				))}
			</View>
			<FlatList
				ref={listRef}
				onMomentumScrollEnd={onScrollEnd}
				data={dashMenus}
				horizontal
				pagingEnabled={true}
				keyExtractor={item => item.name}
				renderItem={({ item }) => {
					return item.comp;
				}}
			/>
			<Button buttonStyle={styles.button} raised title="Cancel" onPress={cancelForm} />
		</View>
	);
};

const styles = StyleSheet.create({
	avatarStyle: {
		height: 50,
		width: 50,
		borderRadius: 25,
	},
	userBox: {
		marginTop: 40,
		alignSelf: 'center',
	},
	container: {
		backgroundColor: '#000',
		flex: 1,
	},
	menuContainer: {
		flexDirection: 'row',
	},
	menu: {
		flexGrow: 1,
	},
});

export default DashScreen;
