import React from 'react';
import { Animated, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';

import Assets from '../Assets';
import Meta from '../constants/Meta';
import EmptyListMessage from './EmptyListMessage';
import Gradient from './Gradient';
import SliderCell from './SliderCell';

const Images = Assets.images;

export default class Slider extends React.Component {
  static defaultProps = {
    onSelectIndex: () => {},
  };

  scroll = new Animated.Value(0);

  state = {
    // width: 0,
    itemWidth: 250,
    swipedAllCards: false,
    // swipeDirection: '',
    isSwipingBack: false,
    cardIndex: 0,
  };

  _onLayout = ({ nativeEvent: { layout } }) => this.setState({ ...layout });

  onItemClick = () => {
    // const { navigator } = this.props;
  };

  renderItem = (item) => {
    if (item) {
      const { uid, index } = item;
      return (
        <SliderCell
          key={uid}
          onPressItem={this.props.onPressItem}
          uid={uid}
          scroll={this.scroll}
          itemWidth={this.state.itemWidth}
          index={index || 0}
        />
      );
    }
    return null;
  };
  _onScrollEnd = (event) => {
    const offset = { ...event.nativeEvent.contentOffset };
    const page = this._calculateCurrentPage(offset.x);
    // estimatedPage = page
    this.props.onSelectIndex(page);
    // this._setCurrentPage(page);
  };
  _calculateCurrentPage = (offset) => {
    const { itemWidth } = this.state;
    return Math.floor(offset / itemWidth);
  };

  componentWillMount() {
    if (this.props.onIndexChange) {
      this.props.onIndexChange(this.state.cardIndex);
    }
  }

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true,
    });
  };

  onSwiped = (cardIndex) => {
    this.updatedIndex(cardIndex + 1);
  };
  jumpTo = () => {
    this.swiper.jumpToCardIndex(2);
  };

  swipeBack = () => {
    if (!this.state.isSwipingBack) {
      this.setIsSwipingBack(true, () => {
        this.swiper.swipeBack((index) => {
          this.setIsSwipingBack(false);
          this.updatedIndex(index);
        });
      });
    }
  };
  setIsSwipingBack = (isSwipingBack, cb) => {
    this.setState(
      {
        isSwipingBack,
      },
      cb,
    );
  };

  updatedIndex = (index) => {
    const dataLength = (this.props.items || []).length;
    let _index = index;
    if (index >= dataLength) {
      _index = null;
    }
    if (this.props.onIndexChange) this.props.onIndexChange(_index);
  };

  get items() {
    const items = this.props.items || [];
    const data = items.map((val, index) => ({ uid: val, index }));

    return data;
  }
  render() {
    // const data = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(v => ({ uri: "http://i.huffpost.com/gen/1706845/images/o-JOE-BUDDEN-facebook.jpg" }));

    const data = this.items;
    // const { width, itemWidth } = this.state;
    // const centerOffset = (width - itemWidth) * 0.5;
    const debug = false;
    return (
      <View
        style={[
          {
            flex: 1,
            width: '100%',
          },
          this.props.style,
        ]}
      >
        <Swiper
          cardStyle={{
            alignItems: 'center',
            backgroundColor: debug ? 'yellow' : 'transparent',
          }}
          ref={(swiper) => {
            this.swiper = swiper;
            if (this.props.swiperRef) this.props.swiperRef(swiper);
          }}
          onSwipedLeft={(index) => {
            this.props.onDislike(data[index].uid);
            this.onSwiped(index);
          }}
          onSwipedRight={(index) => {
            this.props.onLike(data[index].uid);
            this.onSwiped(index);
          }}
          backgroundColor={debug ? 'red' : 'transparent'}
          cards={data}
          cardIndex={this.state.cardIndex}
          cardVerticalMargin={0}
          renderCard={this.renderItem}
          onSwipedAll={this.onSwipedAllCards}
          showSecondCard={false}
          disableBottomSwipe
          disableTopSwipe
          overlayLabels={{
            none: {
              title: '',
              swipeColor: '#9262C2',
              backgroundOpacity: '0.75',
              fontColor: '#FFF',
              style: { wrapper: {} },
            },
            bottom: {
              title: 'BLEAH',
              swipeColor: '#9262C2',
              backgroundOpacity: '0.75',
              fontColor: '#FFF',
              style: { wrapper: {} },
            },
            left: {
              title: 'NAH',
              swipeColor: '#FF6C6C',
              backgroundOpacity: '0.75',
              fontColor: '#FFF',
              style: { wrapper: {} },
            },
            right: {
              title: 'LIT',
              swipeColor: '#4CCC93',
              backgroundOpacity: '0.75',
              fontColor: '#FFF',
              style: { wrapper: {} },
            },
            top: {
              title: 'SUPER LIKE',
              swipeColor: '#4EB8B7',
              backgroundOpacity: '0.75',
              fontColor: '#FFF',
              style: { wrapper: {} },
            },
          }}
          animateOverlayLabelsOpacity
          animateCardOpacity={false}
          infinite
          verticalSwipe
        >
          {/* <Button onPress={this.swipeBack} title="Swipe Back" />
                    <Button onPress={this.jumpTo} title="Jump to last index" /> */}
        </Swiper>
        {data.length === 0 ||
          (!this.props.isInfinite &&
            this.state.swipedAllCards && (
              <Gradient
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <EmptyListMessage
                  inverted
                  onPress={() => {
                    this.setState({ swipedAllCards: false });
                    this.updatedIndex(0);
                  }}
                  color="white"
                  image={Images.empty.users}
                  title={Meta.out_of_booty_title}
                  subtitle={Meta.out_of_booty_subtitle}
                  buttonTitle={Meta.out_of_booty_action}
                />
              </Gradient>
            ))}
      </View>
    );
    // return (

    //     <AnimatedFlatList
    //         ref={this.props.getRef}
    //         style={this.props.style}
    //         horizontal
    //         keyExtractor={(item, index) => `tuner-card-${index}`}
    //         showsHorizontalScrollIndicator={false}
    //         snapToInterval={itemWidth}
    //         scrollEventThrottle={1}
    //         decelerationRate={0}

    //         contentContainerStyle={StyleSheet.flatten([
    //             this.props.contentContainerStyle,
    //             {
    //                 marginLeft: centerOffset,
    //                 alignItems: 'center',
    //                 width: (itemWidth * (data.length) + (centerOffset * 2)),
    //                 // height: size.height,
    //             },
    //         ])}
    //         getItemLayout={(data, index) => (
    //             { length: itemWidth, offset: itemWidth * index, index }
    //         )}
    //         onMomentumScrollEnd={this._onScrollEnd}
    //         onLayout={this._onLayout}
    //         onScroll={Animated.event(
    //             [{ nativeEvent: { contentOffset: { x: this.scroll } } }],
    //             { useNativeDriver: true },
    //         )}
    //         renderItem={this.renderItem}
    //         data={data} />
    // )
  }
}
