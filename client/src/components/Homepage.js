import React from 'react';
import { ScrollView } from 'react-native';
import Headbar from './Headbar';
import PhotoList from './PhotoList';
import { footerSize } from './common/Footer';

const HomePage = () => (
  <ScrollView style={{ marginBottom: footerSize }}>
    <Headbar />
    <PhotoList />
  </ScrollView>
);

export default HomePage;
