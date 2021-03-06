import './Playground.css';
import React, { useState, useEffect, useRef } from 'react';

import { Grid, Box, Card, CardHeader, Button, CardContent } from '@material-ui/core';
import Graph from 'react-graph-vis';
import AddTab from './Components/controlTabs/AddTab';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import { getMap, postNode, postNodeDelete, postNodeEdit } from '../../api';

import { withRouter } from 'react-router';

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

const Playground = (props) => {
  const classes = useStyles();

  const { id } = props.match.params;
  console.log(props.match.params);
  const [network, setNetwork] = useState();
  const [graph, setGraph] = useState({
    id: null,
    desc: 'idk',
    nodes: [],
    edges: []
  });

  const [selectedNode, setSelectedNode] = useState();

  const addTitleRef = useRef();
  const addResourceRef = useRef();
  const addGroupRef = useRef();

  const graphRef = useRef(
    {
      title: 'new graph!',
      desc: 'new desc!',
      nodes: [],
      edges: []
    });

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

    const newNode = { label: title, group: group, res: resource };
    callback(newNode);
  };

  const handleEditNode = (nodeData, callback) => {
    if (!addTitleRef.current || !addGroupRef.current || !addResourceRef.current) {
      callback();
    }
    const title = addTitleRef.current.value;
    const group = addGroupRef.current.value;
    const resource = addResourceRef.current.value;

    const newNode = { label: title, group: group, res: resource };
    callback(newNode);
  };

  const options = {
    layout: {
      hierarchical: true
    },
    manipulation: {
      enabled: true,
      addNode: handleAddNode,
      deleteNode: (nodeData, callback) => {
        console.log(nodeData.nodes);
        callback(nodeData);
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
      <CardHeader title='Playground' />

      <Grid container spacing={2} justify='center' alignItems='stretch' direction='row'>
        <Grid item xs='4'>
          <Box my={1}>
            <Card>
              <CardHeader title='Controls' />
              <CardContent>
                <AddTab
                  titleRef={addTitleRef}
                  resourceRef={addResourceRef}
                  groupRef={addGroupRef}
                />
              </CardContent>
            </Card>
          </Box>
          <Box my={1}>
            <Card>
              <CardHeader title='Topics' />
              <CardContent>
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
          <Card style={{ paddingBottom: '40px' }}>
            <CardHeader title='Roadmap' />
            {graph
              ? <Graph
                  graph={graph}
                  options={options}
                  events={events}
                  getNetwork={(net) => { setNetwork(net); }}
                />
              : <p>Loading...</p>}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default withRouter(Playground);
