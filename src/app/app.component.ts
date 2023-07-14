import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare let InjectQuorumEnvironment: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'weiss-chart-poc';

  @ViewChild('quorum') quorumContainer?: ElementRef<HTMLDivElement>

  public selectedState = '';

  

  private data = [];

  colors = ["#02fdec", "#fda302", "#5a02fd", "#02fd11", "#fd023d", "#0286fd", "#cffd02", "#e202fd", "#02fd98", "#fd4f02", "#0602fd", "#47fd02", "#fd0291", "#02dafd", "#fdd702", "#8e02fd", "#02fd44", "#fd0209", "#0252fd", "#9bfd02", "#fd02e4", "#02fdcc", "#fd8302", "#3a02fd", "#13fd02", "#fd025d", "#02a6fd", "#effd02", "#c202fd", "#02fd78", "#fd2f02", "#021efd", "#67fd02", "#fd02b1", "#02fafd", "#fdb702", "#6e02fd", "#02fd24", "#fd0229", "#0272fd", "#bbfd02", "#f502fd", "#02fdac", "#fd6302", "#1a02fd", "#34fd02", "#fd027d", "#02c6fd"]

  public props = {
    ordinalAccessor: 'disability',
    valueAccessor: 'value',
    groupAccessor: 'state',
    data: [],
    states: [] as string[]
}

  constructor(){



    fetch('assets/data.json').then((res) => res.json())
    .then((data) => {

      this.data = data;
      
      this.props.states = this.data.map((dt: any) => dt.State)

    })

  }


  private buildQuorum(){

    const code = `use Libraries.Compute.Statistics.DataFrame
    use Libraries.Interface.Controls.Charts.BarChart
    use Libraries.Compute.Statistics.Columns.TextColumn
    use Libraries.Compute.Statistics.Columns.NumberColumn
    
    /*
        This is an example of how to read in data with data frames
    */
    
    // create frame component
    DataFrame frame
    // read in data from dog csv
    
    // identify columns
    
    // text-based columns
    TextColumn col
    TextColumn col1
    TextColumn col2
    TextColumn col3
    TextColumn col4
    frame:AddColumnOnLoad(1,col)
    frame:AddColumnOnLoad(2,col1)
    frame:AddColumnOnLoad(3,col2)
    frame:AddColumnOnLoad(10,col3)
    frame:AddColumnOnLoad(11, col4)
    
    // number-based columns
    NumberColumn numCol
    NumberColumn numCol1
    NumberColumn numCol2
    NumberColumn numCol3
    NumberColumn numCol4
    NumberColumn numCol5
    NumberColumn numCol6
    frame:AddColumnOnLoad(0,numCol)
    frame:AddColumnOnLoad(4,numCol1)
    frame:AddColumnOnLoad(5,numCol2)
    frame:AddColumnOnLoad(6,numCol3)
    frame:AddColumnOnLoad(7,numCol4)
    frame:AddColumnOnLoad(8,numCol5)
    frame:AddColumnOnLoad(9,numCol6)
    
    frame:Load("assets/data/Alabama.csv")
    
    
    
    // pull out specified columns from csv that we are comparing
    
    frame:AddSelectedFactors("Breed Group") // this will pull out the breed group from table and label on the x axis
    frame:AddSelectedColumns("Maximum Weight") // this will pull out the max weight from table and label on the y axis
    frame:AddSelectedColumns("Minimum Weight")
    frame:AddSelectedColumns("Maximum Height")
    frame:AddSelectedColumns("Minimum Height")
    
    // using the data frame, format data by creating a bar chart component
    BarChart chart = frame:BarChart()
    
    chart:ShowLegend(false)
    chart:SetTitle("Example of displaying Dogs.csv")
    
    // display chart on window
    chart:Display(100,100)`


    InjectQuorumEnvironment(this.quorumContainer?.nativeElement, 'Chart POC', code)




  }

  onChange(){
    
    const stateData = this.data.filter((item: any) => item.State === this.selectedState);


    const graph = stateData.flatMap((item: any) => {

      const state = item['State'];

      const keys = Object.keys(item).filter((key) => key !== 'State' && key !== 'All disabilities' && item[key] > 0);

      return keys.map((key) => ({state, disability: key, value: item[key]}))

    }) as any;

    


    this.props.data = graph;

    this.buildQuorum();
  }



}




