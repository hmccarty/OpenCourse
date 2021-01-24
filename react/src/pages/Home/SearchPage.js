import React from 'react';
import { Grid, Card, Box, CardHeader, CardContent } from '@material-ui/core'
import SearchContent from '../../Components/SearchContent';

const SearchPage = () => {
    return (
        <Box m={2}>
            <Grid container spacing={2} justify="center">
                <Grid item xs="7" >
                    <Card>
                        <CardHeader title={'Results'} />
                        <CardContent>
                        <SearchContent />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchPage;