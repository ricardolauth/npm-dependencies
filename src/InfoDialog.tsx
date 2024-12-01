import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Link } from '@mui/material';
import { useEffect, useState } from 'react';
import { InternalGraphNode } from 'reagraph';
import { cache } from './utils';
import { Package } from './types';

interface CustomDialogProps {
    open: boolean;
    onClose: () => void;
    node: InternalGraphNode;
  }

const InfoDialog: React.FC<CustomDialogProps>  = ({ open, onClose, node }) => { 
    const [currentData, setCurrentData] = useState<Package | undefined>(undefined);

    const updateData = () => {
        if(node) {
            cache.forEach(dataPoint => {
                console.log("name: " + dataPoint.name)
                if(dataPoint.name == node.data.name) {
                    setCurrentData(dataPoint);
                }
            })
        }

    }

    useEffect(() => {
        updateData();
    }, [open])

    const handleClose = () => {
        setCurrentData(undefined);
        onClose();
      };
   
    return (
        <div>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{display: "flex", justifyContent: "center" }}>{node ? node.data.name : "" }</DialogTitle>
            <DialogContent>
                <span style={{fontWeight: 'bold', marginRight: '5px'}}>Maintainer: </span>
                {currentData
                ? currentData.maintainers.map((maintainer, index) => (
                    <span key={index}>
                        {maintainer.name}
                        {index < currentData.maintainers.length - 1 && ', '}
                    </span>
                    ))
                : ""}
                <p style={{marginRight: '5px'}}>
                    <strong>Last Updated:</strong> {currentData ? currentData.time.modified.toString() : ""}
                </p>
                <p style={{marginRight: '5px'}}>
                    <strong>Homepage:</strong> <Link target="_blank" href={currentData ? currentData.homepage : ""}>{currentData ? currentData.homepage : ""}</Link>
                </p>
                <p style={{marginRight: '5px'}}>
                    <strong>License:</strong> {currentData ? currentData.license : ""}
                </p>
                <p style={{marginRight: '5px'}}>
                    <strong>Description:</strong> {currentData ? currentData.description : ""}
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Schließen
                </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export default InfoDialog