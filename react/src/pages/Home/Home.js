import './Home.css';
import React, { useState, useEffect, useRef } from 'react';

import { Grid, Box, Card, CardHeader, Button, CardContent, Divider, Typography } from '@material-ui/core';
import Graph from 'react-graph-vis';
import AddTab from './Components/controlTabs/AddTab';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import { getMap, postNode, postNodeDelete, postNodeEdit } from '../../api';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

const Home = (props) => {
  const classes = useStyles();

  const { id } = props.match.params;
  const [network, setNetwork] = useState();
  const [graph, setGraph] = useState();

  const [selectedNode, setSelectedNode] = useState();

  const addTitleRef = useRef();
  const addResourceRef = useRef();
  const addGroupRef = useRef();

  useEffect(() => {
    const graph = getMap(id).then((res) => {
      const mapObj = res.maps[0];
      const newGraph = {
        id: mapObj.id,
        title: mapObj.title,
        desc: mapObj.desc,
        nodes: mapObj.map.nodes,
        edges: mapObj.map.edges
      };
      setGraph(newGraph);
    });
  }, []);

  const events = {
    click: function (event) {
      const { nodes, edges } = event;
      if (!nodes.length) return;

      const nodeId = nodes[0];
      network.focus(nodeId,
        {
          locked: true,
          animation: {
            duration: 1000,
            easingFunction: 'easeInOutQuad'
          }
        });
      const selectedNode = graph.nodes.filter((node) => (node.id === nodeId));
      setSelectedNode(selectedNode[0]);
    }
  };

  const handleTopicClick = (nodeId) => {
    network.focus(nodeId,
      {
        locked: true,
        animation: {
          locked: false,
          duration: 1000,
          easingFunction: 'easeInOutQuad'
        }
      });
  };

  const handleAddNode = (nodeData, callback) => {
    if (!addTitleRef.current || !addGroupRef.current || !addResourceRef.current) {
      callback();
    }
    const title = addTitleRef.current.value;
    const group = addGroupRef.current.value;
    const resource = addResourceRef.current.value;

    const newNode = { ...nodeData, label: title, group: group, resource: resource };
    callback(newNode);
    postNode(graph.id, 2, newNode.id, newNode.label, newNode.resource, null);
  };

  // const handleDeleteNode = (nodeData, callback) => {
  //   setGraph((prevGraph) => {
  //     const nodeId = nodeData.nodes[0];
  //     const newNodes = prevGraph.nodes.filter(node => (node.id !== nodeId));
  //     const newEdges = prevGraph.edges.filter(edge => {
  //       for (let i = 0; i < nodeData.edges.length; i++) {
  //         if (nodeData.edges[i] === edge.id) return false;
  //       }

  //       return true;
  //     });
  //     network.network.setData(newNodes, newEdges);
  //     return { nodes: [...newNodes], edges: [...newEdges] };
  //   });

  //   const handleAddEdge = () => {

  //   };
  // };

  const handleEditNode = (nodeData, callback) => {
    if (!addTitleRef.current || !addGroupRef.current || !addResourceRef.current) {
      callback();
    }
    const title = addTitleRef.current.value;
    const group = addGroupRef.current.value;
    const resource = addResourceRef.current.value;

    const newNode = { ...nodeData, label: title, group: group, resource: resource };
    callback(newNode);
    postNodeEdit(graph.id, 2, nodeData.id, title, group, resource);
  };

  const options = {
    layout: {
      hierarchical: true
    },
    manipulation: {
      enabled: true,
      addNode: handleAddNode,
      deleteNode: (nodeData, callback) => {
        callback(nodeData);
        postNodeDelete(graph.id, 2, nodeData.id)
          .then(() => { alert('SUCEESS'); })
          .catch(() => { alert('ERROR'); });
      },
      editNode: handleEditNode,
      deleteEdge: (edgeData, callback) => {
        callback(edgeData);
      }
    },
    edges: {
      color: '#000000'
    },
    nodes: {
      shape: 'dot'
    },
    autoResize: true,
    height: '450px'
  };

  return (
    <Box m={2}>
      <CardHeader title='Purdue University MA 162' titleTypographyProps={{variant:'h4' }}/>
      <hr style={{height:"15px", backgroundColor:"#b0c77e", border:'none'}}/>
      <Grid container spacing={2} justify='center' alignItems='stretch' direction='row'>
        <Grid item xs='4'>
          <Box my={1} boxShadow={4}>
            <Card style={{backgroundColor:'#f2ebdd'}}>
              <CardContent>
              <Typography variant="h5">Controls</Typography>
                <Divider/>
                <AddTab
                  titleRef={addTitleRef}
                  resourceRef={addResourceRef}
                  groupRef={addGroupRef}
                />
              </CardContent>
            </Card>
          </Box>
          <Box my={1} boxShadow={4}>
            <Card style={{backgroundColor:'#f2ebdd'}}>
              <CardContent>
              <Typography variant="h5">Topics</Typography>
                <Divider/>
                {graph
                  ? graph.nodes.map((node) => (
                    <p key={node.id} style={{ cursor: 'pointer' }} onClick={() => handleTopicClick(node.id)}>{node.label}</p>
                    ))
                  : <p>Loading...</p>}
              </CardContent>
            </Card>
          </Box>
          {selectedNode
            ? (
              <Modal
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                className={classes.modal}
                open={selectedNode}
                onClose={() => { setSelectedNode(null); }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500
                }}
              >
                <Fade in={selectedNode}>
                  <div className={classes.paper}>
                    <h2 id='transition-modal-title'>Resources - {selectedNode.label}</h2>
                    <p id='transition-modal-description'>{selectedNode.resource}</p>
                  </div>
                </Fade>
              </Modal>
              )

            : null}

        </Grid>
        <Grid item xs='8'>
          <Box boxShadow={4}>
          <Card style={{ paddingBottom: '40px', backgroundColor:'#f2ebdd' }}>
            <CardContent><Typography variant="h5">Map</Typography>
                <Divider/>
            {graph
              ? <Graph
                  graph={graph}
                  options={options}
                  events={events}
                  getNetwork={(net) => { setNetwork(net); }}
                />
              : <p>Loading...</p>}
              </CardContent>
          </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
