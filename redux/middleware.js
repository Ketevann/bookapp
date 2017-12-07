// import axios from 'axios';

// export const apiMiddleware = store => next => action => {
//     // Pass all actions through by default
//     next(action);

//     switch (action.type) {
   
//     case 'GET_BOOKLIST_DATA':
//         let bookTitles=[];
//         const baseUrl='https://www.googleapis.com/books/v1/volumes?q=',
//             key1='&key=AIzaSyDhYAmhr3NlkGgbj123FweCy6PnDFHcCbk',
//             key2='&key=AIzaSyCs8Tkv_NUbbfArk39pdi1tRUbqEzBlaaw';
//             console.log('GET_BOOKLIST_DATA');
    
//         axios.get('https://tastedive.com/api/similar?q=the+epic+of+gilgamesh&k=291171-booksapp-5DFKTYU4&limit=10')
//         .then((response)=> {
//             console.log(response.data.Similar.Results);
//             response.data.Similar.Results.map((object) => object.Type === 'book' ?  bookTitles.push(axios.get(baseUrl+object.Name+key2)):null);    
//             return bookTitles;

//         }).then((response)=>{
//                 axios.all(response)
//                     .then(axios.spread((...args) => {
//                         let data=[];
//                         args.map((args)=>{
//                             // console.log(args.data.items[0].volumeInfo.title);
//                             //console.log(args.data.items[0].volumeInfo);
//                             data.push(args.data.items[0].volumeInfo.title+'\n');
//                         })

//                         return next({
//                             type: 'GET_BOOKLIST_DATA_RECIEVED',
//                             payload:data,  
//                         })
//                     })).catch((error) => {
//                         console.error(error);
//                     });

//             //console.log(response);
//         }).catch((error)=> {
//             console.log(error);
//         });
//         break;


//         case 'LOAD_DEFAULT_BOOKLIST_DATA':
//         console.log("LOAD_DEFAULT_BOOKLIST_DATA middleware")
//         let defualtBookTitles=[];
       
//         const baseUrlcopy='https://www.googleapis.com/books/v1/volumes?q=';
//             key2copy='&key=AIzaSyCs8Tkv_NUbbfArk39pdi1tRUbqEzBlaaw',
//             // key2copy='&key=AIzaSyDhYAmhr3NlkGgbj123FweCy6PnDFHcCbk';

//             //console.log('LOAD_DEFAULT_BOOKLIST_DATA',action.defaultBookList);
//             action.payload.map((object) => object.Type === 'book' ?  defualtBookTitles.push(axios.get(baseUrlcopy+object.Name+key2copy)):null);  
//               //console.log(defualtBookTitles);
//                 axios.all(defualtBookTitles)
//                     .then(axios.spread((...args) => {
//                         let data=[];
//                         args.map((args)=>{
//                             console.log(args.data.items[0].volumeInfo.title, "sth");
//                             //console.log(args.data.items[0].volumeInfo);
//                             // data.push(args.data.items[0].volumeInfo.title+'\n');
//                             //  data.push(args.data.items[0].volumeInfo.imageLinks.thumbnail+'\n');
//                             data.push(args.data.items[0].volumeInfo);
                            
//                         })

//                         return next({
//                             type: 'DEFAULT_BOOKLIST_DATA_RECIEVED',
//                             payload:data,  
//                         })
//                     })).catch((error) => {
//                         console.error(error);
//                     });

           

//     break;
 
//     // Do nothing if the action does not interest us
//     default:
//     //console.log("defualt activated");
//     break;
//   }
// };

