import { LightningElement, wire} from 'lwc';
import BOOKCHANNEL from '@salesforce/messageChannel/BooksChannel__c'
import { APPLICATION_SCOPE, MessageContext, subscribe} from 'lightning/messageService'

const columns = [
    { 
        label: 'Title', 
        fieldName: 'title', 
        sortable: true,
    },
    { 
        label: 'Author', 
        fieldName: 'author',
        sortable: true,
    },
    { 
        label: 'Status', 
        fieldName: 'status',
        sortable: true,
    },
    { label: 'Delete', fieldName: '', cellAttributes: {iconName: 'action:delete', alignment: 'center'} },
    { label: 'Edit', fieldName: '', cellAttributes: {iconName: 'action:edit', alignment: 'center'} },
];

export default class AllBooksList extends LightningElement {

    columns = columns
    bookList = []
    subscription
    sortDirection
    sortedBy

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
            const { title, author, status} = message.lmsData;
            
            this.bookList.push({
                title: title.value || '',
                author: author.value || '',
                status: status.value || '',
            });
            this.bookList = [...this.bookList];
        }
    }

    sortHandler(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.bookList));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.bookList = parseData;
        //[...this.bookList] = parseData;
    }    
    //Sort logic
    // sortBy(field, reverse, primer) {
    //     const key = primer
    //         ? function (x) {
    //               return primer(x[field]);
    //           }
    //         : function (x) {
    //               return x[field];
    //           };
    //           return function (a, b) {
    //             a = key(a);
    //             b = key(b);
    //             return reverse * ((a > b) - (b > a));
    //         };
    //     }

        // sortHandler(event) {
        //     const { fieldName: sortedBy, sortDirection } = event.detail;
        //     const cloneData = [...this.bookList];
    
        //     cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        //     this.bookList = cloneData;
        //     this.sortDirection = sortDirection;
        //     this.sortedBy = sortedBy;
        // }
    }
    
   

    // disconnectedCallback() {
    //     window.removeEventListener('submit', this.handleFormSubmit);
    // }
