import React from 'react';
import Bridge from '../Middleware/bridge';
// import { Alert } from "reactstrap";
// import {ACCESS_POINT} from '../../../config/index';
// import http from "../../../Middleware/http";
import Datatable from "../Component/Datatable/Datatable";
import swal from 'sweetalert';
// import '../style1.css';
//import '../../../Component/loader.css';
// import SingleSelect from '../../../Component/SingleSelect';





class AddRule extends React.Component
{
    constructor(props)
    {
        super(props)
        {
            this.state=
            {
                Data :[],
                column: [
                    {
                      Header: "Rule",
                      accessor: "rule"
                    },
                    
                    {
                        Header: "Edit",
                        accessor: "edit",
                        Cell: (d) => this.edit(d),
                      },
                      {
                        Header: "Delete",
                        accessor: "delete",
                        Cell: (d) => this.delete(d),
                      },
                ],
                ButtonName1:true,
                Options:[],
                selectedCountry:{},
                EditId:null,
                Index:null,
                name:null,
                errorname:"",
                errorselected:""
            }
        }
    }


    delete = (d) => {

        return (
            <center>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => this.deletion(d)}
          >
            Delete
          </button>
          </center>
        );
      };


deletion =async(value)=>{

    const previousData = [...this.state.Data];
    // Seperating data row using row-index
    const getData = { ...previousData[value.index] };

    //getting id on that data
    const id = getData.id;
    //removing specific id in previous state data
    const Data = previousData.filter((delelteid) => delelteid.id !== id);

    try {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this !",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async(willDelete) => {
           
            if (willDelete) {
                const result = await Bridge.deleteMaster(
                    id
                  );
                  if (result) {
                      console.log(result);
                    this.setState({ Data });
                    swal("Poof! Your Data has been deleted!", {
                        icon: "success",
                      });
                    // setTimeout(() => this.setState({ formAlertdelete: false }), 3000);
                  }
              
            } else {
              swal("Your Data  is safe!");
            }
          });
     
    } catch (error) {
      this.setState({ data: previousData });
      console.log(error);
    }
    
}

    edit = (d) => {
        let value = d;
        return (
          <center>
            <button
              type="button"
              className="btn btn-info"
              data-toggle="modal"
               data-target="#addvendar"
               onClick={() => this.edition(value)}
            >
              Edit
            </button>
          </center>
        );
      };

      edition =async(e)=>{
         let value = e.original;
         

          this.setState({
              ButtonName1:false,
              EditId : value.id,
              name : value.location,
              Index: e.index,

          })

          window.scroll({
            top: 100,
            left: 100,
            behavior: 'smooth'
          });
      }

    Status = (d)=>{
        if(d.original.status == 0){

            return (
                <center>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => this.StatusChange(d)}
              >
               Inactive 
              </button>
              </center>
            );

        }else{
            return (
                <center>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => this.StatusChange(d)}
              >
               Active 
              </button>
              </center>
            );
        }
    }

    StatusChange = async(e)=>{
        let value = e.original.status;
        let id = e.original.id;
        let index = e.index;

        const previousData = [...this.state.Data];
       // console.log(e.original)
      //  console.log(previousData)
  
        let arr = {};
 
        if(value === 0){
         
        
         arr.status = 1
 
        }else{
 
         arr.status = 0
        }
 
        //let 
 
       try{
 
         const Update = await Bridge.updateMaster("tbl_state",id,arr);
 
         previousData[index].status = arr.status;
         
 
         if(Update){
            this.setState({
              Data:previousData
            })
         }
 
       }catch(error){
         console.log(error);
       }
     }


     HandleOption = async(e)=>{
         console.log(e)
         this.setState({
            selectedCountry : e
         })
     }
 

    async componentDidMount(){
        try{
            
            const result = await Bridge.GetRule();
            console.log(result);
            if(result.data.length){
                this.setState({
                    Data:result.data
                })
            }

        }catch(error){
            console.log(error);
        }
    }

    handleChange = async(e) =>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    submit = async()=>{
        const { selectedCountry , name } = this.state;

      
        
        if(!name){
            this.setState({
                errorname :" Enter the rule name "
            })
            return false
        }else if(name == null){
            this.setState({
                errorname :" Enter the rule name "
            })
            return false
        }else{
            this.setState({
                errorname:""
            })
        }  

        const formData=new FormData();
        formData.append("rule",name);
        // formData.append( "country_id" , selectedCountry.value );

        console.log([...formData])
        try{

            const submit = await Bridge.AddRules(formData);
            console.log(submit);
           if(submit.data == false){
                
            this.setState({
                errorname :"rule  already exists"
            })




           }else{
              let arr = {};
                  arr.rule = name;
                //   arr.countryname = selectedCountry.label;
                  arr.id = submit.data.insertId;

                  let newData = [arr,...this.state.Data];
                  console.log(newData);
                this.setState({
                    name:"",
                    selectedCountry :{},
                    Data:newData,
                    errorname:"",
                    errorselected:""
                })
            }

        }catch(error){
            console.log(error)
        }
    }

    Update = async()=>{
        const { selectedCountry ,EditId,Index, name } = this.state;

        let arr = { };
        arr.location = name ;
        // arr.countryname = selectedCountry.label;
      //  arr.id =  ;
        try{

            const Update = await Bridge.UpdateLocation(EditId,arr);
            //if(Update){

            if(Update){
                console.log(Update);
                  
                 

                  let newData = [{arr},...this.state.Data];

                  newData[Index].location = name;
                  // newData[Index].countryname = selectedCountry.label;
                  // newData[Index].country_id =   selectedCountry.value;
// 
                this.setState({
                    name:"",
                    // selectedCountry :{},
                    Data:newData
                })
            }

        }catch(error){
            console.log(error)
        }
    }




    render(){
        const { ButtonName1 } =this.state;
        return(
            <React.Fragment>
             <div class="main-content">
             <section class="section">
                <div class="section-body">
                <div class="row">
                <div class="col-12">
                <div class="card">
                <div class="card-header">
                <h3>Rule</h3>
                </div>
               
                <div class="card-body">
                 
                <div className="row form-group">
                <div className="col-sm-2"></div>
                <div className="col-sm-2">
                <label class="labell2">Add Rule</label>
                </div>
                <div className="col-sm-4">
                <input type="text"
                class="form-control"
                placeholder="Enter the name"
                onChange={this.handleChange}
                value={this.state.name}
                name="name"/>
                </div>
                <div className="col-sm-3"> <span class="errormsg" style={{color:"red"}}>{this.state.errorname}</span> </div>
                </div>

                <div class="row form-group">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                <button type="button"
                style={{width:'100%'}} 
                onClick={ ButtonName1 === true ? this.submit : this.Update  }
                class="btn btn-primary m-t-15 waves-effect">
                    {ButtonName1 === true ? "Add Rule" : "Update Rule" }
                    </button>
                </div>
                <div className="col-sm-4"></div>
                </div>

                <div className="row form-group">
                <div className="col-sm-12">
                {this.state.Data.length ? (
                    <Datatable
                    data={this.state.Data}
                    columnHeading={this.state.column}
                    />
                ) : null}
                </div>
                </div>

                </div>

                </div>
                </div>
                </div>
                    </div>
                    </section>
             </div>
            </React.Fragment>
        )
    }

}

export default AddRule;