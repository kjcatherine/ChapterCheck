import { LightningElement, wire, track} from 'lwc';
import BOOKCHANNEL from '@salesforce/messageChannel/BooksChannel__c'
import { APPLICATION_SCOPE, MessageContext, subscribe, publish} from 'lightning/messageService'

const actions = [
    { label: 'Edit', name: 'Edit', iconName: 'utility:edit' },
    { label: 'Delete', name: 'Delete', iconName: 'utility:delete' },
];

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
    {
        type: 'button-icon',
        initialWidth: 34,
        typeAttributes:
        {
            iconName: 'utility:delete',
            name: 'delete',
            iconClass: 'slds-icon-text-error'
        }
    },
    {
        type: 'button-icon',
        initialWidth: 34,
        typeAttributes:
        {
            iconName: 'utility:edit',
            name: 'edit'
        }
    }
];

export default class AllBooksList extends LightningElement {

    columns = columns;
    @track bookList = [];
    @track sortBy;
    @track sortDirection;
    @track selectedRowData = {};
    @track isEditing = false;

    
    // bookList = []
    subscription
    // sortDirection
    // sortedBy
    
    @wire(MessageContext)
    context

    connectedCallback() {
        this.handleFormSubmit()
    }

    handleFormSubmit() {
        this.subscription = subscribe(this.context, BOOKCHANNEL, (message)=>{this.handleFormMessage(message)}, {scope:APPLICATION_SCOPE})
    }

    handleFormMessage(message){
        if (message) {
            const { title, author, status} = message.lmsData;
            
            this.bookList.push({
                id: Date.now(),
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

    // handleRowAction(event) {
    //     const action = event.detail.action.name;
    //     const row = event.detail.row;
    //     if (action === 'delete') {
    //         const rowIndex = this.bookList.findIndex(item => item.Id === row.Id);
    //         if (rowIndex !== -1) {
    //             this.bookList.splice(rowIndex, 1);
    //             this.bookList = [...this.bookList];
    //         }
    //     }
    // }

    handleRowAction(event) {
        const action = event.detail.action.name;
        const row = event.detail.row;

        if (action === 'delete') {
            this.deleteRow(row);
        } else if (action === 'edit') {
            // Publish the selected row data to the form component
            const message = {
                lmsData: {
                    title: { value: row.title },
                    author: { value: row.author },
                    status: { value: row.status }
                }
            };
            publish(this.context, BOOKCHANNEL, message);
        }
    }

    deleteRow(rowToDelete) {
        const rowIndex = this.bookList.findIndex((item) => item.id === rowToDelete.id);
        if (rowIndex !== -1) {
            this.bookList.splice(rowIndex, 1);
            this.bookList = [...this.bookList];
        }
    }

    editRow(rowToEdit) {
        // Pass the selected row data to the form component
        this.selectedRowData = rowToEdit;
        this.isEditing = true;
    }
    
    // Handle the save and cancel events from the form component
    handleSave(event) {
        const editedData = event.detail;
        const rowIndex = this.bookList.findIndex((item) => item.id === this.selectedRowData.id);
        if (rowIndex !== -1) {
            this.bookList[rowIndex] = editedData;
            this.bookList = [...this.bookList];
        }
        this.isEditing = false;
    }

    handleCancel() {
        this.isEditing = false;
    }
    
    }
    