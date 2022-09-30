import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	Appearance,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	PermissionsAndroid,
	Button,
	Text,
	TextInput,
	View,
	Image,
	Pressable,
	BackHandler,
	TouchableOpacity,
	TouchableNativeFeedback,
	Platform
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {ThemeProvider} from 'styled-components';
import styled from 'styled-components/native';
import Slider from '@react-native-community/slider';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { isWebUri } from 'valid-url';
const io = require("socket.io-client");
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer,createNavigationContainerRef   } from '@react-navigation/native';
const Stack = createNativeStackNavigator();
import {enableScreens} from 'react-native-screens';
enableScreens();

const uniqueId = uuidv4();

console.log('UID',uniqueId);
var socket;

var socket_counter = 0;
var gps_active = false;

var setAppStateG2=function(){};
var setStatusTextG;
var setUrlStateG;
var setSizeStateG;
var setLoggedInG=function(){};

var srt1on = false;
var srt2on = false;
var srt1mute = false;
var srt2mute = false;
var mapOn = false;
var map2On = false;

const socketSrt1mute = () => {
	if(srt1mute){
		if(socket && socket.connected){
			socket.emit('srt1muteOff',uniqueId);
			srt1mute=false;
			setAppStateG({srt1mutetext:''});
		}
	}else{
		if(socket && socket.connected){
			socket.emit('srt1mute',uniqueId);
			srt1mute=true;
			setAppStateG({srt1mutetext:' M'});
		}
	}
}
const socketSrt2mute = () => {
	if(srt2mute){
		if(socket && socket.connected){
			socket.emit('srt2muteOff',uniqueId);
			srt2mute=false;
			setAppStateG({srt2mutetext:''});
		}
	}else{
		if(socket && socket.connected){
			socket.emit('srt2mute',uniqueId);
			srt2mute=true;
			setAppStateG({srt2mutetext:' M'});
		}
	}
}
const socketMap = () => {
	if(mapOn){
		if(socket && socket.connected){
			socket.emit('mapoff',uniqueId);
			mapOn=false;
			setAppStateG({mapcol:'#55f'});
		}
	}else{
		if(socket && socket.connected){
			socket.emit('mapon',uniqueId);
			mapOn=true;
			map2On=false;
			setAppStateG({mapcol:'#070'});
			setAppStateG({map2col:'#55f'});
		}
	}
}
const socketMap2 = () => {
	if(map2On){
		if(socket && socket.connected){
			socket.emit('mapoff2',uniqueId);
			map2On=false;
			setAppStateG({map2col:'#55f'});
		}
	}else{
		if(socket && socket.connected){
			socket.emit('mapon2',uniqueId);
			map2On=true;
			mapOn=false;
			setAppStateG({mapcol:'#55f'});
			setAppStateG({map2col:'#070'});
		}
	}
}
var clearPress = false;
var clear2Press = false;
const socketMapClear = () => {
	if(!clearPress){
		setAppStateG({clearcol:'#f55'});
		clearPress=true;
		setTimeout(()=>{
			if(clearPress){
				setAppStateG({clearcol:'#55f'});
				clearPress=false;
			}
		},2000);
	}
	else if(socket && socket.connected){
		clearPress=false;
		setAppStateG({clearcol:'#55f'});
		socket.emit('clear3',uniqueId);
	}
}
const socketMap2Clear = () => {
	if(!clear2Press){
		setAppStateG({clear2col:'#f55'});
		clear2Press=true;
		setTimeout(()=>{
			if(clear2Press){
				setAppStateG({clear2col:'#55f'});
				clear2Press=false;
			}
		},2000);
	}
	else if(socket && socket.connected){
		clear2Press=false;
		setAppStateG({clear2col:'#55f'});
		socket.emit('clear2',uniqueId);
	}
}
var tweetPress = false;
const socketTweet = () => {
	if(!tweetPress){
		setAppStateG({tweetcol:'#f55'});
		tweetPress=true;
		setTimeout(()=>{
			if(tweetPress){
				setAppStateG({tweetcol:'#55f'});
				tweetPress=false;
			}
		},2000);
	}
	else if(socket && socket.connected){
		socket.emit('tweet');
		tweetPress=false;
		setAppStateG({tweetcol:'#55f'});
	}
}
var recPress = false;
var rtmp1Press = false;
var rtmp2Press = false;
var rtmp3Press = false;
var recOn = false;
const socketRec = () => {
	if(recOn){
		if(!recPress){
			setAppStateG({reccol:'#f55'});
			recPress=true;
			setTimeout(()=>{
				if(recPress){
					setAppStateG({reccol:'#070'});
					recPress=false;
				}
			},2000);
		}
		else if(socket && socket.connected){
			socket.emit('recstop',uniqueId);
			recPress=false;
			recOn=false;
			setAppStateG({reccol:'#55f'});
		}
	}else{
		if(!recPress){
			setAppStateG({reccol:'#ff5'});
			recPress=true;
			setTimeout(()=>{
				if(recPress){
					setAppStateG({reccol:'#55f'});
					recPress=false;
				}
			},2000);
		}
		else if(socket && socket.connected){
			socket.emit('recstart',uniqueId);
			recPress=false;
			recOn=true;
			setAppStateG({reccol:'#070'});
		}
	}
}
var rtmp1On = false;
const socketRtmp1 = () => {
	if(rtmp1On){
		if(!rtmp1Press){
			setAppStateG({rtmp1col:'#f55'});
			rtmp1Press=true;
			setTimeout(()=>{
				if(rtmp1Press){
					setAppStateG({rtmp1col:'#070'});
					rtmp1Press=false;
				}
			},2000);
		}
	else if(socket && socket.connected){
			socket.emit('rtmp1stop',uniqueId);
			rtmp1Press=false;
			rtmp1On=false;
			setAppStateG({rtmp1col:'#55f'});
		}
	}else{
		if(!rtmp1Press){
			setAppStateG({rtmp1col:'#ff5'});
			rtmp1Press=true;
			setTimeout(()=>{
				if(rtmp1Press){
					setAppStateG({rtmp1col:'#55f'});
					rtmp1Press=false;
				}
			},2000);
		}
	else if(socket && socket.connected){
			socket.emit('rtmp1start',uniqueId);
			rtmp1Press=false;
			rtmp1On=true;
			setAppStateG({rtmp1col:'#070'});
		}
	}
}
var rtmp2On = false;
const socketRtmp2 = () => {
	if(rtmp2On){
		if(!rtmp2Press){
			setAppStateG({rtmp2col:'#f55'});
			rtmp2Press=true;
			setTimeout(()=>{
				if(rtmp2Press){
					setAppStateG({rtmp2col:'#070'});
					rtmp2Press=false;
				}
			},2000);
		}
		else if(socket && socket.connected){
			socket.emit('rtmp2stop',uniqueId);
			rtmp2Press=false;
			rtmp2On=false;
			setAppStateG({rtmp2col:'#55f'});
		}
	}else{
		if(!rtmp2Press){
			setAppStateG({rtmp2col:'#ff5'});
			rtmp2Press=true;
			setTimeout(()=>{
				if(rtmp2Press){
					setAppStateG({rtmp2col:'#55f'});
					rtmp2Press=false;
				}
			},2000);
		}
		else if(socket && socket.connected){
			socket.emit('rtmp2start',uniqueId);
			rtmp2Press=false;
			rtmp2On=true;
			setAppStateG({rtmp2col:'#070'});
		}
	}
}
var rtmp3On = false;
const socketRtmp3 = () => {
	if(rtmp3On){
		if(!rtmp3Press){
			setAppStateG({rtmp3col:'#f55'});
			rtmp3Press=true;
			setTimeout(()=>{
				if(rtmp3Press){
					setAppStateG({rtmp3col:'#070'});
					rtmp3Press=false;
				}
			},2000);
		}
		else if(socket && socket.connected){
			socket.emit('rtmp3stop',uniqueId);
			rtmp3Press=false;
			rtmp3On=false;
			setAppStateG({rtmp3col:'#55f'});
		}
	}else{
		if(!rtmp3Press){
			setAppStateG({rtmp3col:'#ff5'});
			rtmp3Press=true;
			setTimeout(()=>{
				if(rtmp3Press){
					setAppStateG({rtmp3col:'#55f'});
					rtmp3Press=false;
				}
			},2000);
		}
		else if(socket && socket.connected){
			socket.emit('rtmp3start',uniqueId);
			rtmp3Press=false;
			rtmp3On=true;
			setAppStateG({rtmp3col:'#070'});
		}
	}
}
var sceneMode=1;
const socketScene1 = () => {
	if(sceneMode!=1){
		if(socket && socket.connected){
			socket.emit('scene1',uniqueId);
			sceneMode=1;
			var newAppState = {};
			newAppState.scene1col='#070';
			newAppState.scene2col='#55f';
			newAppState.sceneMixcol='#55f';
			newAppState.sceneMix1col='#55f';
			newAppState.sceneMix2col='#55f';
			newAppState.sceneMixNonecol='#55f';
			setAppStateG(newAppState);
		}
	}
}
const socketScene2 = () => {
	if(sceneMode!=2){
		if(socket && socket.connected){
			socket.emit('scene2',uniqueId);
			sceneMode=2;
			var newAppState = {};
			newAppState.scene1col='#55f';
			newAppState.scene2col='#070';
			newAppState.sceneMixcol='#55f';
			newAppState.sceneMix1col='#55f';
			newAppState.sceneMix2col='#55f';
			newAppState.sceneMixNonecol='#55f';
			setAppStateG(newAppState);

		}
	}
}
const socketSceneMix = () => {
	if(sceneMode!=3){
		if(socket && socket.connected){
			socket.emit('sceneMix',uniqueId);
			sceneMode=3;
			var newAppState = {};
			newAppState.scene1col='#55f';
			newAppState.scene2col='#55f';
			newAppState.sceneMixcol='#070';
			newAppState.sceneMix1col='#55f';
			newAppState.sceneMix2col='#55f';
			newAppState.sceneMixNonecol='#55f';
			setAppStateG(newAppState);
		}
	}
}
const socketSceneMix1 = () => {
	if(sceneMode!=31){
		if(socket && socket.connected){
			socket.emit('sceneMix1',uniqueId);
			sceneMode=31;
			var newAppState = {};
			newAppState.scene1col='#55f';
			newAppState.scene2col='#55f';
			newAppState.sceneMixcol='#55f';
			newAppState.sceneMix1col='#070';
			newAppState.sceneMix2col='#55f';
			newAppState.sceneMixNonecol='#55f';
			setAppStateG(newAppState);
		}
	}
}
const socketSceneMix2 = () => {
	if(sceneMode!=32){
		if(socket && socket.connected){
			socket.emit('sceneMix2',uniqueId);
			sceneMode=32;
			var newAppState = {};
			newAppState.scene1col='#55f';
			newAppState.scene2col='#55f';
			newAppState.sceneMixcol='#55f';
			newAppState.sceneMix1col='#55f';
			newAppState.sceneMix2col='#070';
			newAppState.sceneMixNonecol='#55f';
			setAppStateG(newAppState);
		}
	}
}
const socketSceneMixNone = () => {
	if(sceneMode!=4){
		if(socket && socket.connected){
			socket.emit('sceneMixNone',uniqueId);
			sceneMode=4;
			var newAppState = {};
			newAppState.scene1col='#55f';
			newAppState.scene2col='#55f';
			newAppState.sceneMixcol='#55f';
			newAppState.sceneMix1col='#55f';
			newAppState.sceneMix2col='#55f';
			newAppState.sceneMixNonecol='#070';
			setAppStateG(newAppState);
		}
	}
}
var introOn = false;
const socketIntro = () => {
	if(!introOn){
		if(socket && socket.connected){
			socket.emit('modeIntro',uniqueId);
			introOn=true;
			extroOn=false;
			setAppStateG({introcol:'#070'});
			setAppStateG({extrocol:'#55f'});
		}
	}else{
		if(socket && socket.connected){
			socket.emit('modeNormal',uniqueId);
			introOn=false;
			extroOn=false;
			setAppStateG({introcol:'#55f'});
			setAppStateG({extrocol:'#55f'});
		}
	}
}
var extroOn = false;
const socketExtro = () => {
	if(!extroOn){
		if(socket && socket.connected){
			socket.emit('modeExtro',uniqueId);
			introOn=false;
			extroOn=true;
			setAppStateG({introcol:'#55f'});
			setAppStateG({extrocol:'#070'});
		}
	}else{
		if(socket && socket.connected){
			socket.emit('modeNormal',uniqueId);
			introOn=false;
			extroOn=false;
			setAppStateG({introcol:'#55f'});
			setAppStateG({extrocol:'#55f'});
		}
	}
}
const socketShot = () => {
	if(socket && socket.connected){
		socket.emit('getShot',uniqueId);
		socket.emit('getState',uniqueId);
		console.log('getState');
	}
	setAppStateG({imguri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYwAAADYCAIAAAB3M0NIAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TxSItInYQcchQnayIijhKFYtgobQVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4BQqPCVLNrAlA1y0jFY2I2tyr2vEJAAP0YR0hipp5IL2bgOb7u4ePrXZRneZ/7c4SUvMkAn0g8x3TDIt4gntm0dM77xGFWkhTic+Ixgy5I/Mh12eU3zkWHBZ4ZNjKpeeIwsVjsYLmDWclQiaeJI4qqUb6QdVnhvMVZrdRY6578hcG8tpLmOs1hxLGEBJIQIaOGMiqwEKVVI8VEivZjHv4hx58kl0yuMhg5FlCFCsnxg//B727NwtSkmxSMAd0vtv0xAvTsAs26bX8f23bzBPA/A1da219tALOfpNfbWuQI6NsGLq7bmrwHXO4Ag0+6ZEiO5KcpFArA+xl9Uw4YuAV619zeWvs4fQAy1NXyDXBwCIwWKXvd492Bzt7+PdPq7wdmHHKiSMerMAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YCCBEvCyuXARIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABEElEQVR42u3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgLcB62UAATGAzeEAAAAASUVORK5CYII='});
}
const socketAudioLevel = () => {
	if(socket && socket.connected){
		socket.emit('getAudioLevel',uniqueId);
	}
	setAppStateG({img2uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYwAAADYCAIAAAB3M0NIAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TxSItInYQcchQnayIijhKFYtgobQVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4BQqPCVLNrAlA1y0jFY2I2tyr2vEJAAP0YR0hipp5IL2bgOb7u4ePrXZRneZ/7c4SUvMkAn0g8x3TDIt4gntm0dM77xGFWkhTic+Ixgy5I/Mh12eU3zkWHBZ4ZNjKpeeIwsVjsYLmDWclQiaeJI4qqUb6QdVnhvMVZrdRY6578hcG8tpLmOs1hxLGEBJIQIaOGMiqwEKVVI8VEivZjHv4hx58kl0yuMhg5FlCFCsnxg//B727NwtSkmxSMAd0vtv0xAvTsAs26bX8f23bzBPA/A1da219tALOfpNfbWuQI6NsGLq7bmrwHXO4Ag0+6ZEiO5KcpFArA+xl9Uw4YuAV619zeWvs4fQAy1NXyDXBwCIwWKXvd492Bzt7+PdPq7wdmHHKiSMerMAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YCCBEvCyuXARIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABEElEQVR42u3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgLcB62UAATGAzeEAAAAASUVORK5CYII='});
}
var currentBy;
var currentText;
const confirmText = () => {
	setAppStateG({infoText:''});
	if(currentBy && currentText && socket && socket.connected){
		if(currentBy) socket.emit('respond','confirmed: '+currentText,currentBy);
	}
}


var socket_initialized = false;
function connectSocket() {
	console.log('connectSocket');
	if(socket_initialized) {
		if(socket.io.uri != "wss://"+storage_data.ws+":3334"){
			console.log('reconn '+storage_data.ws);
			socket.disconnect();
			socket_initialized = false;
			socket=null;
			connectSocket();
		}else{
			console.log('is initialized'+storage_data.ws);
			if(socket && socket.connected)
				if(gLoggedin){
					gLoggedin=false;
					setLoggedInG(true);
				}
		}
		return;
	}
	socket_initialized = true;

	if (!isWebUri("https://"+storage_data.ws+":3334")) {
		console.log("Not a valid url.");
		return;
	}

	try{
		socket = io("wss://"+storage_data.ws+":3334", { transports: ["websocket"] });
		console.log('connecting');
		socket.on('connect_error', (error) => {
			if(setStatusTextG){
				setStatusTextG(error.toString());
			}
			console.log('c error '+error);
		});
		socket.on('connect', () => {
			console.log('conneced');
			if(gLoggedin){
				gLoggedin=false;
				setLoggedInG(true);
			}
			socket.emit('getState',uniqueId);
			console.log('getState');
		});
		socket.on('disconnect', () => {
			console.log('disconneced');
		});
		socket.on('error', (error) => {
			console.log('error '+error);
		});
		socket.on('reconnect', (a) => {
			console.log('reconnect '+a);
		});
		socket.on("connect_error", (error) => {
			console.log('conn error '+error);
		});
		socket.on('shot', (data,id) => {
			if(id == null || uniqueId == id) {
				setAppStateG({'imgUri':data});
			}
		});
		socket.on('audioLevel', (data,id) => {
			if(id == null || uniqueId == id) {
				setAppStateG({'img2Uri':data});
			}
		});
		socket.on('infoText', (data,by) => {
			setAppStateG({'infoText':data});
			currentBy = by;
			currentText = data;
			if(socket && socket.connected){
				if(by)socket.emit('respond','delivered: '+data,by);
			}
		});
		socket.on('ytCount', (data) => {
			setAppStateG({'rtmp2text':data});
		});
		socket.on('audio_1', (data) => {
			setAppStateG({'srt1text':data});
		});
		socket.on('audio_2', (data) => {
			setAppStateG({'srt2text':data});
		});
		socket.on('state', (state,reply,id) => {
			console.log(reply);
			console.log(id);
			try{
			if(reply){
				if(uniqueId != id) {
					console.log('reply not for me',uniqueId,id);
				//	return;
				}
			}else{
				if(uniqueId == id) {
					console.log('state from self');
				//	return;
				}
			}
			//if(!setScene1ColG){
			//	setTimeout(()=>{if(socket && socket.connected) {socket.emit('getState',uniqueId);};},2000);
			//}
			
			var newAppState = {};
			if(state.sceneMode == 1){
				sceneMode=1;
				newAppState.scene1col='#070';
				newAppState.scene2col='#55f';
				newAppState.sceneMixcol='#55f';
				newAppState.sceneMix1col='#55f';
				newAppState.sceneMix2col='#55f';
				newAppState.sceneMixNonecol='#55f';
			}
			else if(state.sceneMode == 2){
				sceneMode=2;
				newAppState.scene1col='#55f';
				newAppState.scene2col='#070';
				newAppState.sceneMixcol='#55f';
				newAppState.sceneMix1col='#55f';
				newAppState.sceneMix2col='#55f';
				newAppState.sceneMixNonecol='#55f';
			}
			else if(state.sceneMode == 3){
				sceneMode=3;
				newAppState.scene1col='#55f';
				newAppState.scene2col='#55f';
				newAppState.sceneMixcol='#070';
				newAppState.sceneMix1col='#55f';
				newAppState.sceneMix2col='#55f';
				newAppState.sceneMixNonecol='#55f';
			}
			else if(state.sceneMode == 31){
				sceneMode=31;
				newAppState.scene1col='#55f';
				newAppState.scene2col='#55f';
				newAppState.sceneMixcol='#55f';
				newAppState.sceneMix1col='#070';
				newAppState.sceneMix2col='#55f';
				newAppState.sceneMixNonecol='#55f';
			}
			else if(state.sceneMode == 32){
				sceneMode=32;
				newAppState.scene1col='#55f';
				newAppState.scene2col='#55f';
				newAppState.sceneMixcol='#55f';
				newAppState.sceneMix1col='#55f';
				newAppState.sceneMix2col='#070';
				newAppState.sceneMixNonecol='#55f';
			}
			else if(state.sceneMode == 4){
				sceneMode=4;
				newAppState.scene1col='#55f';
				newAppState.scene2col='#55f';
				newAppState.sceneMixcol='#55f';
				newAppState.sceneMix1col='#55f';
				newAppState.sceneMix2col='#55f';
				newAppState.sceneMixNonecol='#070';
			}

			if(state.mode == 'intro'){
				introOn=true;
				extroOn=false;
				newAppState.introcol='#070';
				newAppState.extrocol='#55f';
			}
			else if(state.mode == 'extro'){
				introOn=false;
				extroOn=true;
				newAppState.introcol='#55f';
				newAppState.extrocol='#070';
			}
			else if(state.mode == 'normal'){
				introOn=false;
				extroOn=false;
				newAppState.introcol='#55f';
				newAppState.extrocol='#55f';
			}

			if(state.map){
				mapOn=true;
				newAppState.mapcol='#070';
			}else{
				mapOn=false;
				newAppState.mapcol='#55f';
			}
			if(state.map2){
				map2On=true;
				newAppState.map2col='#070';
			}else{
				map2On=false;
				newAppState.map2col='#55f';
			}

			if(state.rec){
				recOn=true;
				newAppState.reccol='#070';
			}else{
				recOn=false;
				newAppState.reccol='#55f';
			}

			if(state.rtmp1){
				rtmp1On=true;
				newAppState.rtmp1col='#070';
			}else{
				rtmp1On=false;
				newAppState.rtmp1col='#55f';
			}

			if(state.rtmp2){
				rtmp2On=true;
				newAppState.rtmp2col='#070';
			}else{
				rtmp2On=false;
				newAppState.rtmp2col='#55f';
			}

			if(state.rtmp3){
				rtmp3On=true;
				newAppState.rtmp3col='#070';
			}else{
				rtmp3On=false;
				newAppState.rtmp3col='#55f';
			}

			if(state.srt1){
				srt1on = true;
				newAppState.srt1col='#070';
			}else{
				srt1on = false;
				newAppState.srt1col='#55f';
				newAppState.srt1text='SRT1';
			}

			if(state.srt2){
				srt2on = true;
				newAppState.srt2col='#070';
			}else{
				srt2on = false;
				newAppState.srt2col='#55f';
				newAppState.srt2text='SRT2';
			}

			if(state.srt1mute){
				srt1mute = true;
				newAppState.srt1mutetext=' M';
			}else{
				srt1mute = false;
				newAppState.srt1mutetext='';
			}

			if(state.srt2mute){
				srt2mute = true;
				newAppState.srt2mutetext=' M';
			}else{
				srt2mute = false;
				newAppState.srt2mutetext='';
			}
			setAppStateG(newAppState);
			console.log(JSON.stringify(state));
			} catch (e){
				console.log(e);
			}
		});
	}catch(e){
		console.log(e);
	}
};

console.log(uniqueId);

var watchId = null;
var gLoggedin = false;

const setUrl = function(url) {
	if(!storage_data)storage_data = {};
	storage_data.ws = url;
	AsyncStorage.setItem('obsctrl_data',JSON.stringify(storage_data));
	console.log(url);
	gLoggedin=true;
	connectSocket();
}
const setSize = function(size) {
	if(!storage_data)storage_data = {};
	storage_data.buttonSize = size;
	AsyncStorage.setItem('obsctrl_data',JSON.stringify(storage_data));
}

const requestLocationPermission = async () => {

	console.log(watchId);
	if(gps_active) {
		if(watchId != null){
			Geolocation.clearWatch(watchId);
			Geolocation.stopObserving();
			watchId=null;
			gps_active=false;
			setAppStateG({'gpsText':'Stopped'});
		}else{
			console.log('no watchid');
		}
		return;
	}
	console.log("ask");
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
				title: "Location Permission",
				message: "Grant?",
				buttonNeutral: "Ask Me Later",
				buttonNegative: "Cancel",
				buttonPositive: "OK"
			}
		);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log("You can use the GPS");
			gps_active=true;
			setAppStateG({'gpsText':'GPS OK'});
			watchId = Geolocation.watchPosition(
				position => {
					const initialPosition = JSON.stringify(position);
					console.log('GPS:'+JSON.stringify(initialPosition));
					if(socket && socket.connected){
						socket.emit('tpv2',{lat:position.coords.latitude,lon:position.coords.longitude,speed:position.coords.speed});
						socket_counter++;
						setAppStateG({'gpsText':socket_counter.toString()});
					}else{
						setAppStateG({'gpsText':'NO CONN'});
					}

				},
				error => {
					console.log(JSON.stringify(error));
					setAppStateG({'gpsText':JSON.stringify(error)});
				},
				{enableHighAccuracy: true, distanceFilter:5}
			);
			console.log(watchId);
		} else {
			console.log("GPS permission denied");
			setAppStateG({'gpsText':'Denied'});
		}	
	} catch (err) {
		console.warn(err);
	}
};

var storage_data = null;

async function getStorageData(){
	try {
		const value = await AsyncStorage.getItem('obsctrl_data');
		if(value) {
			storage_data = JSON.parse(value);
			if(setUrlStateG)setUrlStateG(storage_data.ws);
			if(setSizeStateG)setSizeStateG(storage_data.buttonSize);
			if(storage_data.ws){
				if(!socket || !socket.connected){
					connectSocket();
					gLoggedin=true;
				}
			}
		}
	} catch(e) {
	}
}

getStorageData();

var appState = {
	infoText: '',
	gpsText: 'Init',
	srt1col: '#55f',
	srt2col: '#55f',
	mapcol: '#55f',
	clearcol: '#55f',
	map2col: '#55f',
	clear2col: '#55f',
	introcol: '#55f',
	extrocol: '#55f',
	tweetcol: '#55f',
	rtmp1col: '#55f',
	rtmp2col: '#55f',
	rtmp3col: '#55f',
	reccol: '#55f',
	scene1col: '#55f',
	scene2col: '#55f',
	sceneMixcol: '#55f',
	sceneMix1col: '#55f',
	sceneMix2col: '#55f',
	sceneMixNonecol: '#55f',
	srt1mutetext: '',
	srt2mutetext: '',
	srt1text: 'SRT1',
	srt2text: 'SRT2',
	rtmp2text: 'RTMP2',
	imgUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYwAAADYCAIAAAB3M0NIAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TxSItInYQcchQnayIijhKFYtgobQVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4BQqPCVLNrAlA1y0jFY2I2tyr2vEJAAP0YR0hipp5IL2bgOb7u4ePrXZRneZ/7c4SUvMkAn0g8x3TDIt4gntm0dM77xGFWkhTic+Ixgy5I/Mh12eU3zkWHBZ4ZNjKpeeIwsVjsYLmDWclQiaeJI4qqUb6QdVnhvMVZrdRY6578hcG8tpLmOs1hxLGEBJIQIaOGMiqwEKVVI8VEivZjHv4hx58kl0yuMhg5FlCFCsnxg//B727NwtSkmxSMAd0vtv0xAvTsAs26bX8f23bzBPA/A1da219tALOfpNfbWuQI6NsGLq7bmrwHXO4Ag0+6ZEiO5KcpFArA+xl9Uw4YuAV619zeWvs4fQAy1NXyDXBwCIwWKXvd492Bzt7+PdPq7wdmHHKiSMerMAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YCCBEvCyuXARIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABEElEQVR42u3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgLcB62UAATGAzeEAAAAASUVORK5CYII=',
	img2Uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYwAAADYCAIAAAB3M0NIAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TxSItInYQcchQnayIijhKFYtgobQVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4BQqPCVLNrAlA1y0jFY2I2tyr2vEJAAP0YR0hipp5IL2bgOb7u4ePrXZRneZ/7c4SUvMkAn0g8x3TDIt4gntm0dM77xGFWkhTic+Ixgy5I/Mh12eU3zkWHBZ4ZNjKpeeIwsVjsYLmDWclQiaeJI4qqUb6QdVnhvMVZrdRY6578hcG8tpLmOs1hxLGEBJIQIaOGMiqwEKVVI8VEivZjHv4hx58kl0yuMhg5FlCFCsnxg//B727NwtSkmxSMAd0vtv0xAvTsAs26bX8f23bzBPA/A1da219tALOfpNfbWuQI6NsGLq7bmrwHXO4Ag0+6ZEiO5KcpFArA+xl9Uw4YuAV619zeWvs4fQAy1NXyDXBwCIwWKXvd492Bzt7+PdPq7wdmHHKiSMerMAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YCCBEvCyuXARIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABEElEQVR42u3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgLcB62UAATGAzeEAAAAASUVORK5CYII='
}
	
function setAppStateG(state){
	setAppStateG2(state);
	for(var key of Object.keys(state)){
		appState[key]=state[key];
	}
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...appState,
			currentTheme: Appearance.getColorScheme()==='dark',
		};
		setAppStateG2=this.setAppState.bind(this);
	}
	
	componentWillUnmount()
	{
		setAppStateG2=function(){};
	}
	componentDidMount(){
	}

	setAppState(state){
		this.setState(state);
	}

	render() {
		const backgroundStyle = {backgroundColor:'#121212',flex:1,userSelect: 'none',margin:0};
		
		return (
			<ScrollView style={backgroundStyle}>
					<View>
						<Pressable style={{alignItems: 'center',justifyContent: 'center',paddingVertical: 2,paddingHorizontal: 0,borderRadius: 14,elevation: 3,backgroundColor:'#000'}} onPress={()=>{confirmText();}}>
							<Text style={{color:'#f00'}}>{this.state.infoText}</Text>
						</Pressable>
					</View>
					<View style={{flexDirection: "row",flex:1}}>
						<View style={{ flex: 1,padding:3 }}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:"#55f"}} onPress={requestLocationPermission}>
								<Text style={styles.textButton}>{this.state.gpsText}</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1 ,padding:3}}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.srt1col}} onPress={socketSrt1mute}>
								<Text style={styles.textButton}>{this.state.srt1text + this.state.srt1mutetext}</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1 ,padding:3}}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.srt2col}} onPress={socketSrt2mute}>
								<Text style={styles.textButton}>{this.state.srt2text + this.state.srt2mutetext}</Text>
							</PlattformedButton>
						</View>
					</View>
					<View style={{flexDirection: "row",flex:1}}>
						<View style={{ flex: 1,padding:3 }}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.mapcol}} onPress={socketMap}>
								<Text style={styles.textButton}>Map</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1 ,padding:3}}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.clearcol}} onPress={socketMapClear}>
								<Text style={styles.textButton}>Clear</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1,padding:3 }}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.map2col}} onPress={socketMap2}>
								<Text style={styles.textButton}>Map2</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1 ,padding:3}}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.clear2col}} onPress={socketMap2Clear}>
								<Text style={styles.textButton}>Clear2</Text>
							</PlattformedButton>
						</View>
					</View>
					<View style={{flexDirection: "row",flex:1}}>
						<View style={{ flex: 1,padding:3 }}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.introcol}} onPress={socketIntro}>
								<Text style={styles.textButton}>Intro</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1, padding:3 }}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.extrocol}} onPress={socketExtro}>
								<Text style={styles.textButton}>Extro</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1, padding:3 }}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.tweetcol}} onPress={socketTweet}>
								<Text style={styles.textButton}>Tweet</Text>
							</PlattformedButton>
						</View>
					</View>
					<View style={{flexDirection: "row",flex:1}}>
						<View style={{ flex: 1,padding:3 }}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.rtmp1col}} onPress={socketRtmp1}>
								<Text style={styles.textButton}>RTMP1</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1, padding:3 }}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.rtmp2col}} onPress={socketRtmp2}>
								<Text style={styles.textButton}>{this.state.rtmp2text}</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1 ,padding:3}}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.rtmp3col}} onPress={socketRtmp3}>
								<Text style={styles.textButton}>RTMP3</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1 ,padding:3}}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.reccol}} onPress={socketRec}>
								<Text style={styles.textButton}>Rec</Text>
							</PlattformedButton>
						</View>
					</View>
					<View style={{flexDirection: "row",flex:1}}>
						<View style={{ flex: 1,padding:3}}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.scene1col}} onPress={socketScene1}>
								<Text style={styles.textButton}>1</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1, padding:3 }}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.scene2col}} onPress={socketScene2}>
								<Text style={styles.textButton}>2</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1 ,padding:3}}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.sceneMixcol}} onPress={socketSceneMix}>
								<Text style={styles.textButton}>Mix</Text>
							</PlattformedButton>
						</View>
					</View>
					<View style={{flexDirection: "row",flex:1}}>
						<View style={{ flex: 1, padding:3 }}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.sceneMix1col}} onPress={socketSceneMix1}>
								<Text style={styles.textButton}>Mix1</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1, padding:3 }}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.sceneMix2col}} onPress={socketSceneMix2}>
								<Text style={styles.textButton}>Mix2</Text>
							</PlattformedButton>
						</View>
						<View style={{ flex: 1 ,padding:3}}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:this.state.sceneMixNonecol}} onPress={socketSceneMixNone}>
								<Text style={styles.textButton}>None</Text>
							</PlattformedButton>
						</View>
					</View>
					<View style={{flexDirection: "row",flex:1,padding:3}}>
						<Pressable style={{alignItems: 'center',justifyContent: 'center',paddingVertical: 0,paddingHorizontal: 0,borderRadius: 0,elevation: 0}} onPress={socketShot}>
							<Image
								style={{width: 198,height: 108}}
								source={{
									uri: this.state.imgUri
								}}
							/>
						</Pressable>
					</View>
					<View style={{flexDirection: "row",flex:1,padding:3}}>
						<Pressable style={{alignItems: 'center',justifyContent: 'center',paddingVertical: 0,paddingHorizontal: 0,borderRadius: 0,elevation: 0}} onPress={socketAudioLevel}>
							<Image
								style={{width: 198,height: 108}}
								source={{
									uri: this.state.img2Uri
								}}
							/>
						</Pressable>
					</View>
					<View style={{flexDirection: "row",flex:1}}>
						<View style={{ flex: 1, padding:3 }}>
							<PlattformedButton style={{alignItems: 'center',justifyContent: 'center',paddingVertical: storage_data&&storage_data.buttonSize?storage_data.buttonSize:8,paddingHorizontal: 0,borderRadius: 2,elevation: 3,backgroundColor:"#55f"}} onPress={function(){console.log('aa');gLoggedin=false;setLoggedInG(false);}}>
								<Text style={styles.textButton}>Settings</Text>
							</PlattformedButton>
						</View>
					</View>
			</ScrollView>
		);
	}
}
class PlattformedButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	render() {
		if(Platform.OS=='web'){
			return (
				<TouchableOpacity style={this.props.style} onPress={this.props.onPress}>
					{this.props.children}
				</TouchableOpacity>
			);
		}
		else if(Platform.OS=='android'){
			return (
				<TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('white',false)} onPress={this.props.onPress}>
					<View style={this.props.style}>
						{this.props.children}
					</View>
				</TouchableNativeFeedback>
			);
		}
	}
}
class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTheme: Appearance.getColorScheme(),
			url: storage_data?storage_data.ws:'',
			buttonSize: (storage_data&&storage_data.buttonSize)?storage_data.buttonSize:8,
			statusText:''
		};
		this.url=storage_data?storage_data.ws:'';
		this.buttonSize= (storage_data&&storage_data.buttonSize)?storage_data.buttonSize:8;
		setStatusTextG=this.setStatusText.bind(this);
		setUrlStateG=this.setUrlState.bind(this);
		setSizeStateG=this.setSizeState.bind(this);
		this.subscription = Appearance.addChangeListener(({ colorScheme }) => {
			this.setState({currentTheme:Appearance.getColorScheme()});
		});
	}
	
	componentWillUnmount()
	{
		setStatusTextG=function(){};
		this.subscription.remove()
	}
	componentDidMount(){
	}

	setStatusText(text){
		this.setState({statusText:text});
	}
	setUrlState(url){
		this.setState({url:url});
		this.url=url;
	}
	setSizeState(size){
		this.setState({buttonSize:size});
		this.buttonSize=size;
	}
	setUrl(url){
		this.url=url;
	}
	setSize(val){
		this.buttonSize=val;
	}

	render() {
		const backgroundStyle = {flex:1,userSelect: 'none',margin:0};
	
		return (
			<ThemeProvider theme={this.state.currentTheme === 'dark' ? darkTheme : lightTheme}>
			<StyledScrollView style={backgroundStyle}>
						<View style={{flexDirection: "row",flex:1}}>
							<View style={{ flex: 1,padding:12 }}>
								<StyledText style={styles.text}>ObsCtrl Backend Hostname:</StyledText>
							</View>
						</View>
						<View>
							<TextInput
								style={{...styles.input,backgroundColor:'#fff',color:'#000'}}
								onChangeText={newText => this.setUrl(newText)}
								defaultValue={this.state.url}
							/>
						</View>
						<View style={{flexDirection: "row",flex:1}}>
							<View style={{ flex: 1,padding:12 }}>
								<StyledText style={styles.text}>Button Size:</StyledText>
							</View>
						</View>
						<View style={{padding:12}}>
							<Slider
								style={{flex:1}}
								step={1}
								onValueChange={val => this.setSize(val)}
								value={this.state.buttonSize}
								minimumValue={2}
								maximumValue={8}
							/>
						</View>
						<View style={{flexDirection: "row",flex:1}}>
							<View style={{ flex: 1,padding:12 }}>
								<Button title="OK" onPress={()=>{setSize(this.buttonSize);if (!isWebUri("https://"+this.url+":3334")) {this.setStatusText("Not a valid host: \""+this.url+"\"") }else{this.setStatusText("");setUrl(this.url)}}}>
								</Button>
							</View>
							<View style={{ flex: 1,padding:12 }}>
								<Button title="Cancel" onPress={()=>{if(socket && socket.connected)setLoggedInG(true)}}>
								</Button>
							</View>
						</View>
						<View style={{flexDirection: "row",flex:1}}>
							<View style={{ flex: 1,padding:12 }}>
								<Text style={{...styles.text,color:'#f00'}}>{this.state.statusText}</Text>
							</View>
						</View>
					</StyledScrollView>
			</ThemeProvider>
		);
	}
}

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: false,
		};
		setLoggedInG=this.setLoggedIn.bind(this);
	}

	setLoggedIn(c){
		this.setState({isLoggedIn:c});
	}

	render() {
		let {isLoggedIn} = this.state;
		if (isLoggedIn) {
			return (<App/>);
		} else {
			return (<Settings/>);
		}
	}
}


class MyStack extends Component {
	constructor(props) {
		super(props);
		setLoggedInG=this.setLoggedIn.bind(this);
		this.navigationRef = createNavigationContainerRef();
	}
	componentDidMount(){
		this.mounted=true;
		if(this.navigateTo) this.navigationRef.navigate(this.navigateTo);
	}
	setLoggedIn(c){
		if(this.mounted){
			if(c){
				this.navigationRef.navigate("App");
			}else{
				this.navigationRef.navigate("Settings");
			}
		}else{
			if(c){
				this.navigateTo = "App";
			}else{
				this.navigateTo = "Settings";
			}
		}
	}
	render() {
		return (
			<NavigationContainer ref={this.navigationRef}>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name="Settings" component={Settings} />
					<Stack.Screen name="App" component={App} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
const StyledSafeAreaView = styled.SafeAreaView`
	background-color: ${props => props.theme.background};
`;
const StyledScrollView = styled.ScrollView`
	background-color: ${props => props.theme.background};
`;
const StyledText = styled.Text`
	color: ${props => props.theme.foreground};
`;



const styles = StyleSheet.create({
	text: {
		fontSize: 24,
		fontSize: 14,
		fontFamily: "'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
	},
	textButton: {
		color: '#000',
		fontSize: 24,
		fontWeight: '600',
		fontSize: 14,
		fontFamily: "'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
});
const darkTheme = {
	background: "#121212",
	foreground: "#fff",
}
const lightTheme = {
	background: "#fff",
	foreground: "#000",
}


class RootComponent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if(Platform.OS=='web'){
			return <Main/>;
		}else if(Platform.OS=='android'){
			return <MyStack/>;
		}
	}
}
export default RootComponent;

