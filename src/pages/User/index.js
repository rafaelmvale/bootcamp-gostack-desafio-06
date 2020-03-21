import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  LoadingStars,
  Load,
  LoadLabel,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: true,
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    this.loadStarsList();
  }

  async componentDidUpdate(_, prevState) {
    const { page } = this.state;

    if (prevState.page !== page) {
      this.loadStarsList(page);
    }
  }

  loadStarsList = async page => {
    const { navigation } = this.props;
    const { stars } = this.state;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);
    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      loading: false,
    });
  };

  loadMore = () => {
    const { page } = this.state;
    this.setState({ page: page + 1 });
  };

  refreshList = () => {
    this.setState({ page: 1 });
    this.loadStarsList();
  };

  handleNavigate = repo => {
    const { navigation } = this.props;

    navigation.navigate('Repo', { repo });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <LoadingStars loading={loading}>
          {loading ? (
            <Load>
              <LoadLabel>Carregando </LoadLabel>
              <ActivityIndicator color="#7159c1" />
            </Load>
          ) : (
            <Stars
              onEndReachedThreshold={0.2}
              onEndReached={this.loadMore}
              onRefresh={this.refreshList}
              refreshing={refreshing}
              data={stars}
              keyExtractor={star => String(star.id)}
              renderItem={({ item }) => (
                <Starred onPress={() => this.handleNavigate(item)}>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
          )}
        </LoadingStars>
      </Container>
    );
  }
}
