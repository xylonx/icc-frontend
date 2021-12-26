import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import * as React from "react";

// https://s3.us-west-002.backblazeb2.com/pichost-test/990136078980336560_0BF647D467BE2E4C6F8913100947545531F4AFF9_.png

interface ImageCardProp {
    imageID: string;
    imageURL: string;
}

interface ImageCardState {}

class ImageCard extends React.Component<ImageCardProp, ImageCardState> {
    constructor(props: ImageCardProp | Readonly<ImageCardProp>) {
        super(props);
    }

    render() {
        return (
            <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={this.props.imageURL}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {this.props.imageID}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with
                    over 6,000 species, ranging across all continents except
                    Antarctica
                </Typography> */}
                </CardContent>
                <CardActions>
                    {/* <Button size="small">Share</Button> */}
                    <Button size="small">Origin</Button>
                </CardActions>
            </Card>
        );
    }
}

class FormRow extends React.Component {
    constructor(props: any) {
        super(props);
    }
    imageurl =
        "https://s3.us-west-002.backblazeb2.com/pichost-test/990136078980336560_0BF647D467BE2E4C6F8913100947545531F4AFF9_.png";

    render() {
        return (
            <React.Fragment>
                <Grid item xs={6}>
                    {/* <MediaCard imageID="12"></MediaCard> */}
                    <ImageCard
                        imageID="xx.png"
                        imageURL={this.imageurl}
                    ></ImageCard>
                </Grid>
                <Grid item xs>
                    <ImageCard
                        imageID="xx.png"
                        imageURL={this.imageurl}
                    ></ImageCard>
                </Grid>
                <Grid item xs>
                    <ImageCard
                        imageID="xx.png"
                        imageURL={this.imageurl}
                    ></ImageCard>
                </Grid>
            </React.Fragment>
        );
    }
}

class ImageView extends React.Component {
    render() {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    <Grid container item spacing={1}>
                        <FormRow />
                    </Grid>
                    {/* <Grid container item spacing={1}>
                        <FormRow />
                    </Grid>
                    <Grid container item spacing={1}>
                        <FormRow />
                    </Grid> */}
                </Grid>
            </Box>
        );
    }
}

export default ImageView;
