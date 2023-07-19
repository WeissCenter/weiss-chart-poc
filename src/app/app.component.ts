import { DOCUMENT } from '@angular/common';
import { AfterContentInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';

declare let InjectQuorumEnvironment: any;
declare let currentUIContainer_$Global_: any;
declare let Start: any;
import c2mChart from "chart2music";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'weiss-chart-poc';

  @ViewChild('quorum') quorumContainer?: ElementRef<HTMLDivElement>

  @ViewChild('chart') chart?: ElementRef<HTMLDivElement>


  public selectedState = '';




  private data = [];

  colors = ["#02fdec", "#fda302", "#5a02fd", "#02fd11", "#fd023d", "#0286fd", "#cffd02", "#e202fd", "#02fd98", "#fd4f02", "#0602fd", "#47fd02", "#fd0291", "#02dafd", "#fdd702", "#8e02fd", "#02fd44", "#fd0209", "#0252fd", "#9bfd02", "#fd02e4", "#02fdcc", "#fd8302", "#3a02fd", "#13fd02", "#fd025d", "#02a6fd", "#effd02", "#c202fd", "#02fd78", "#fd2f02", "#021efd", "#67fd02", "#fd02b1", "#02fafd", "#fdb702", "#6e02fd", "#02fd24", "#fd0229", "#0272fd", "#bbfd02", "#f502fd", "#02fdac", "#fd6302", "#1a02fd", "#34fd02", "#fd027d", "#02c6fd"]

  public props = {
    ordinalAccessor: 'disability',
    valueAccessor: 'value',
    groupAccessor: 'state',
    data: [],
    states: [] as string[],
    accessibility: {
      longDescription: 'A bar chart showing the child counts per disability in a state',
      executiveSummary: 'IDEA child count',
      elementsAreInterface: false,
      uniqueID: crypto.randomUUID()

    }
}

  constructor(@Inject(DOCUMENT) public doc: Document){



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
    
    frame:Load("assets/data/${this.selectedState}.csv")
    
    
    
    // pull out specified columns from csv that we are comparing
    

frame:AddSelectedColumns("Autism")
frame:AddSelectedColumns("Deaf-blindness")
frame:AddSelectedColumns("Developmental delay")
frame:AddSelectedColumns("Emotional disturbance")
frame:AddSelectedColumns("Hearing impairments")
frame:AddSelectedColumns("Intellectual disabilities")
frame:AddSelectedColumns("Multiple disabilities")
frame:AddSelectedColumns("Orthopedic impairments")
frame:AddSelectedColumns("Other health impairments")
frame:AddSelectedColumns("Specific learning disabilities")
frame:AddSelectedColumns("Speech or language impairments")
frame:AddSelectedColumns("Traumatic brain injury")
frame:AddSelectedColumns("Visual impairments")

    // using the data frame, format data by creating a bar chart component
    BarChart chart = frame:BarChart()
    
    chart:ShowLegend(false)
    chart:SetTitle("IDEA Data")
    
    // display chart on window
    chart:Display(100,100)`

    this.quorumContainer?.nativeElement.childNodes.forEach((c) => c.remove())


    const formData = new FormData();

    formData.append('code', code);
    formData.append('pageURL', window.location.href);
    formData.append('ideName', 'weiss-poc');
    formData.append('build_only', '1');
    formData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);

    fetch("https://quorumlanguage.com/fastrun.php", {method: 'POST', body: formData})
    .then((res) => res.text())
    .then(result => {

      const script = document.createElement('script');

      currentUIContainer_$Global_ = 'quorum-container';

      script.id = 'Runnable'

      script.innerHTML = result;

      this.doc.head.appendChild(script);

      Start();


    })

  //  InjectQuorumEnvironment(this.quorumContainer?.nativeElement, 'Chart POC', code)


  }

  onChange(){
    
    const stateData = this.data.filter((item: any) => item.State === this.selectedState);


    const graph = stateData.flatMap((item: any) => {

      const state = item['State'];

      const keys = Object.keys(item).filter((key) => key !== 'State' && key !== 'All disabilities' && item[key] > 0);

      return keys.map((key) => ({state, disability: key, value: item[key]}))

    }) as any;

    
    
    this.props.data = graph;
    const disabilities = this.props.data.map((gp: any) => gp.disability)

    setTimeout(() => {
      const {err} = c2mChart({
        type: "bar" as any,
        element: this.chart?.nativeElement as any,
        cc: this.doc.getElementById('cc') as any,
        axes: {
          x: {label: 'Disability', format: (idx) => disabilities[idx]},
          y: {label: 'Child Count'}
        },
        data: graph.map((g: any) => g.value)
    });

    }, 1000)

    this.buildQuorum();
  }



}




