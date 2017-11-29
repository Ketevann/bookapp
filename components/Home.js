import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';
import axios  from 'axios';
import { connect } from 'react-redux';
import { getBookListDataRedux, loadDefaultBookListData} from '../redux/actions/actions';
import  defaultList  from './data/defaultList';


class Home extends Component {

  componentDidMount(){
      console.log('mounted');
      
      if (defaultList){
        //console.log(defaultList, "default");
        this.props.loadDefaultBookListData(defaultList.Similar.Results);
      }else{
        console.log("defaultList not loaded");
      }

      //this.props.getBookListDataRedux("the stranger");
      /*
      let bookTitles=[];
      const baseUrl='https://www.googleapis.com/books/v1/volumes?q=',
            key1='&key=AIzaSyDhYAmhr3NlkGgbj123FweCy6PnDFHcCbk',
            key2='&key=AIzaSyCs8Tkv_NUbbfArk39pdi1tRUbqEzBlaaw';

      axios.get('https://tastedive.com/api/similar?q=the+epic+of+gilgamesh&k=291171-booksapp-5DFKTYU4&limit=5')
      .then((response)=> {
          console.log(response.data.Similar.Results);
          response.data.Similar.Results.map((object) => object.Type === 'book' ?  bookTitles.push(axios.get(baseUrl+object.Name+key2)):null);
          return bookTitles;

      }).then((response)=>{
              axios.all(response)
                  .then(axios.spread((...args) => {
                      args.map((args)=>{
                          // console.log(args.data.items[0].volumeInfo.title);
                          console.log(args.data.items[0].volumeInfo);
                      })
                  })).catch((error) => {
                      console.error(error);
                  });

          console.log(response);

    }).catch((error)=> {
        console.log(error);
    });
  */
}


  render() {
    const { defaultBookList} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          { defaultBookList ? defaultBookList:'Loading Defaults'}
        </Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    marginVertical: 20,
  },
});

export default connect(({ bookListData }) => ({ bookListData: bookListData }), { getBookListDataRedux })(Home)

