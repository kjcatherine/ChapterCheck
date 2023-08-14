import { LightningElement, wire} from 'lwc';
import BOOKCHANNEL from '@salesforce/messageChannel/BooksChannel__c'
import { APPLICATION_SCOPE, MessageContext, subscribe} from 'lightning/messageService'

const columns = [
    { label: 'Title', fieldName: 'title' },
    { label: 'Author', fieldName: 'author' },
    { label: 'Status', fieldName: 'status' },
];

export default class AllBooksList extends LightningElement {

    columns = columns
    bookList = []
    subscription
    // receivedMessage = {
    //     title: '',
    //     author: '',
    //     status: ''
    // };

    @wire(MessageContext)
    context

    connectedCallback() {
        this.handleFormSubmit()
    }

    handleFormSubmit() {
        this.subscription = subscribe(this.context, BOOKCHANNEL, (message)=>{this.handleFormMessage(message)}, {scope:APPLICATION_SCOPE})
        // book.id = Date.now(); // Using Date.now() to create a unique identifier
        // this.bookList = [...this.bookList, book];
    }

    handleFormMessage(message){
        if (message) {
            const { title, author, status } = message.lmsData;
            this.bookList.push({
                title: title.value || '',
                author: author.value || '',
                status: status.value || ''
            });
        }
    }
    }
    
   

    // disconnectedCallback() {
    //     window.removeEventListener('submit', this.handleFormSubmit);
    // }
