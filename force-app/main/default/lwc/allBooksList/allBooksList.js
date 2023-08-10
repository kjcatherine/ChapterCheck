import { LightningElement, wire} from 'lwc';
import BOOKCHANNEL from '@salesforce/messageChannel/BooksChannel__c'
import { APPLICATION_SCOPE, MessageContext, subscribe} from 'lightning/messageService';
// const columns = [
//     { label: 'Title', fieldName: 'title' },
//     { label: 'Author', fieldName: 'author' },
//     { label: 'Status', fieldName: 'status' },
//     {
//         type: 'button',
//         initialWidth: 100,
//         typeAttributes: { label: 'Delete', variant: 'destructive', name: 'delete' },
//     },
// ];

export default class AllBooksList extends LightningElement {

    receivedMessage
    subscription

    @wire(MessageContext)
    context

   

    // bookList = [];
    // columns = columns;

    // handleRowSelection(event) {
    //     const selectedRows = event.detail.selectedRows;
    //     const actionName = event.detail.action.name;

    //     if (actionName === 'delete') {
    //         // Delete selected rows
    //         this.deleteSelectedRows(selectedRows);
    //     }
    // }

    // deleteSelectedRows(selectedRows) {
    //     const updatedBookList = [...this.bookList];

    //     selectedRows.forEach((selectedRow) => {
    //         const indexToRemove = updatedBookList.findIndex((book) => book.id === selectedRow.id);
    //         if (indexToRemove !== -1) {
    //             updatedBookList.splice(indexToRemove, 1);
    //             this.bookList = updatedBookList;
    //         }
    //     });
    // }

    connectedCallback() {
        this.handleFormSubmit()
    }

    handleFormSubmit() {
        this.subscription = subscribe(this.context, BOOKCHANNEL, (message)=>{this.handleFormMessage(message)}, {scope:APPLICATION_SCOPE})
        // book.id = Date.now(); // Using Date.now() to create a unique identifier
        // this.bookList = [...this.bookList, book];
    }

    handleFormMessage(message){
        this.receivedMessage = { 
            title: message.title.value ? message.title.value : "No title",
            author: message.author.value ? message.author.value : "No author",
            status: message.status.value ? message.status.value : "No status"
    }
    }
   

    // disconnectedCallback() {
    //     window.removeEventListener('submit', this.handleFormSubmit);
    // }
}
