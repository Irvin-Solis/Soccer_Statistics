import React, {useState, useEffect}from 'react';
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dataTable:{
    margin: 'auto',
    width: '70vw',
  },

  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "10vw",
  },

}));

export default function DataTable(){
  const classes = useStyles();
  const [columns, setColumn] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [Tabledata, setData] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [searchBy, setSearchBy] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamOptionsList, setTeamOptionsList] = useState([]);
  const [teamOpt, setTeamOpt] = useState('');
  const [playerName, setPlayerName] = useState("Noella Dicken");
  const [groupNum, setGroupNum] = useState('0');
  const [groupOptlist, setGroupOptlist] = useState([]);
  const [groupOp, setGroupOpt] = useState('');
  const [optionsList, setOtherOptionslist] = useState([]);
  const [otherOption, setOther] = useState('');

  const [isFetchData, setFetchData] = useState(false);

  const fetchApi = {
    "Player":{
      "Player Stats": 'player/'
    },
    "Team":{
      "Win/Loss Score": 'Team_wins/',
      "Find Group": 'team_grouping/',
      "Team Group Score": 'team_group_score/',
      "Team Last Round": 'teamProgress/',
      "Team Roster": 'team/'
    },
    "Group":{
      "Teams In Group": 'groups/',
      "Group Scoring": 'group_score/',
    },
    "Other":{
      "Teams Knocked Out": 'knockout_teams',
      "Tied Games": 'tie_games',
      "Highest score per Team": 'high_score',
      "Lowest score per Team": 'low_score',
      "World Cup Champions": 'winner',
      "SemiFinal Round": 'semifinals',
      "Team Awards": 'goldenBoot',
      "Champion Matches": 'winnerMatches'
    }
  };

  const pullData = () =>{
    var url = "http://localhost:3001/api/"
    let search = searchBy;
    let param1 = '';
    let opt = '';

    switch (search){
      case 'Team':
        param1 = teamName;
        opt = teamOpt;
        break;
      case 'Player':
        let name = playerName.split(' ');
        console.log(name);
        let newName = name[0] + '&' + name[1];

        param1 = newName;
        opt = 'Player Stats';
        break;
      case 'Group':
        let group = 'Group%20' + groupNum;
        param1 = group;
        opt = groupOp;
        break;
      case 'Other':
        opt = otherOption;
        break;
      default:
        param1 = 'err';

    }
    console.log(opt)
    if(param1 === 'err'){
      return;
    }
    else{
      console.log(opt)
      let paramOpt = fetchApi[searchBy][opt];
      let finalURL = url + paramOpt + param1;
      console.log(finalURL)
      fetch(finalURL)
      .then((res) => res.json())
      .then((data) => {
        if(data.length > 1){
          data = data[0];
        }
        var rows = [];
        var col = new Set();
        data.map(item =>{
          var row = [];
          for(var key in item){
            col.add(key);
            row.push(item[key]);
          }
          rows.push(row);
        })
        let arr = Array.from(col);
        setColumn(arr);
        setData(rows);
      })
    }

  }
  useEffect(()=>{
    if(optionsList.length === 0){
      let other = Object.keys(fetchApi['Other']);
      setOtherOptionslist(other);

      let other1 = Object.keys(fetchApi['Team']);
      setTeamOptionsList(other1);

      let other2 = Object.keys(fetchApi['Group']);
      setGroupOptlist(other2);
    }
    if(teamList.length === 0){
      fetch('http://localhost:3001/api/TeamNames')
        .then((res) => res.json())
        .then((data) =>{
          let teams = [];
          data.map(item =>{
            for(var key in item){
              console.log(item[key]);
              teams.push(item[key])
            }
          })
          setTeamList(teams);
        })
    }
    pullData();
  }, [isFetchData]);

  const options = {
    filter: false,
    selectableRows: "none",
    print: false,
    download: false,
    expandableRows: false,
    rowHover:true,
    pagination:true,
    search:false,
    sortOrder: {name: "Name", direction: "asc"}
  };
    return(
        <div className={classes.dataTable}>
          <Grid container direction="row" justify="flex-end" alignItems="flex-start" spacing={-8}>
            <Button size="large" onClick={()=>{setDialog(true)}}>
              Search &nbsp;
              <SearchIcon/>
            </Button>
          </Grid>
          <Dialog open={dialog} onClose={()=>{setDialog(false)}} fullWidth={true}>
            <DialogTitle>Search Database</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Fill in the Form to update the Table.
              </DialogContentText>
            <Grid   
            container
            direction="row"
            justify="center"
            alignItems="flex-end"
            >
              <Grid item xs={4}>
              <FormControl className={classes.formControl}>
                <InputLabel>Searchable by</InputLabel>
                <Select
                  fullWidth={false}
                  value={searchBy}
                  onChange={(e)=>{setSearchBy(e.target.value)}}
                  className={classes.selectEmpty}
                >
                  <MenuItem value={'Team'}>Team</MenuItem>
                  <MenuItem value={'Player'}>Player</MenuItem>
                  <MenuItem value={'Group'}>Group</MenuItem>
                  <MenuItem value={'Other'}>Other</MenuItem>
                </Select>
              </FormControl>
              </Grid>
              <Grid item xs={4}>
              <FormControl className={classes.formControl}>
                <InputLabel>Teams</InputLabel>
                <Select
                  fullWidth={false}
                  value={teamName}
                  onChange={(e)=>{setTeamName(e.target.value)}}
                  className={classes.selectEmpty}
                  disabled={searchBy==='Team' ? false : true}
                >
                  {teamList.map(teamName => <MenuItem value={teamName}>{teamName}</MenuItem>)}
                </Select>
              </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel>Team Options</InputLabel>
                  <Select
                    fullWidth={false}
                    value={teamOpt}
                    onChange={(e)=>{setTeamOpt(e.target.value)}}
                    className={classes.selectEmpty}
                    disabled={searchBy==='Team' ? false : true}
                  >
                    {teamOptionsList.map(opt => <MenuItem value={opt}>{opt}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="flex-end"
              >
              <Grid item xs={4} />
              <Grid item xs={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Player Name"
                  defaultValue={playerName}
                  onChange={(e)=>{setPlayerName(e.target.value)}}
                  className={classes.selectEmpty}
                  disabled={searchBy==='Player' ? false : true}
                 />
              </FormControl>
              </Grid>
              <Grid item xs={4} />
            </Grid>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="flex-end"
              >
              <Grid item xs={4} />
              <Grid item xs={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  label="Group Number"
                  defaultValue={groupNum}
                  onChange={(e)=>{setGroupNum(e.target.value)}}
                  className={classes.selectEmpty}
                  disabled={searchBy==='Group' ? false : true}
                  error={isNaN(groupNum) ? true : false}
                  helperText={isNaN(groupNum) ? "Invalid Entry: Requires a number" : false}
                 />
              </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel>Group Options</InputLabel>
                  <Select
                    fullWidth={false}
                    value={groupOp}
                    onChange={(e)=>{setGroupOpt(e.target.value)}}
                    className={classes.selectEmpty}
                    disabled={searchBy==='Group' ? false : true}
                  >
                    {groupOptlist.map(opt => <MenuItem value={opt}>{opt}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              
            </Grid>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="flex-end"
              >
              <Grid item xs={4} />
              <Grid item xs={4}>
              <FormControl className={classes.formControl}>
                <InputLabel>Other options</InputLabel>
                  <Select
                    fullWidth={false}
                    value={otherOption}
                    onChange={(e)=>{setOther(e.target.value)}}
                    className={classes.selectEmpty}
                    disabled={searchBy==='Other' ? false : true}
                  >
                    {optionsList.map(option => <MenuItem value={option}>{option}</MenuItem>)}
                  </Select>
              </FormControl>
              </Grid>
              <Grid item xs={4} />
              
            </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                size="large" 
                onClick={() => {
                  setDialog(false)
                  setFetchData(!isFetchData)
                  }}>
                Search &nbsp;
                <SearchIcon/>
              </Button>
            </DialogActions>
          </Dialog>
          <MUIDataTable
            title={"Soccer Table"}
            data={Tabledata}
            columns={columns}
            options={options}
          />
      </div>
    );
}