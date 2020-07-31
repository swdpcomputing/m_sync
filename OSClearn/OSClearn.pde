import controlP5.*;
import oscP5.*;
import netP5.*;

ControlP5 controlP5;
Slider xDistSlider;
Slider yDistSlider;
Slider circleDistSlider;

OscP5 oscP5;
NetAddress myRemoteLocation;

float [][] distances;
float maxDistance;
int yDist = round(32 / 8.0f);
int xDist = round(32 / 8.0f);

void setup()
{
  size(500, 300);

  initDistances();
  createSliders();
  initOsc();
}

void initOsc()
{
  oscP5 = new OscP5(this,8080);

  myRemoteLocation = new NetAddress("127.0.0.1",8080);
  oscP5.plug(this,"onXDist","/xDist");
  oscP5.plug(this, "onYDist", "/yDist");
  oscP5.plug(this, "onCircleDist", "/circleDist");
}

void initDistances()
{
  // diagonal from center
  maxDistance = dist(width/2, height/2, width, height);
  distances = new float[width][height];

  for(int i = 0; i < width; ++i)
  {
    for(int j = 0; j < height; ++j)
    {
       float dist = dist(width/2, height/2, i, j);
       distances[i][j] = dist / 0.5f;
    }
  }
}

void createSliders()
{
  controlP5 = new ControlP5(this);

  xDistSlider = controlP5.addSlider("xDist",
                                    0, // min
                                    127, // max
                                    32, // default value
                                    20, // x
                                    20, // y
                                    100, // width
                                    10); // height

  yDistSlider = controlP5.addSlider("yDist", 0, 127, 32, 20, 40, 100, 10);
  circleDistSlider = controlP5.addSlider("circleDist", 0, 127, 64, 20, 60, 100, 10);
}

void draw()
{
  background(0x000000);

  for(int i = 0; i < width; i += xDist)
  {
    for(int j = 0; j < height; j += yDist)
    {
        stroke(distances[i][j]);
        point(i, j);
    }
  }  

  fill(128);
  rect(10, 10, 160, 70);
}

void onXDist(int value)
{
  xDistSlider.setValue(value);
}

void onYDist(int value)
{
  yDistSlider.setValue(value);
}

void onCircleDist(int value)
{
  circleDistSlider.setValue(value);
}

void circleDist(int value)
{
  float val = value / 127.0f;

  for(int i = 0; i < width; ++i)
  {
    for(int j = 0; j < height; ++j)
    {
       float dist = dist(width/2, height/2, i, j);
       distances[i][j] = dist / val;
    }
  }
}

void xDist(int value)
{
  xDist = round(value / 8.0f) + 1;
}

void yDist(int value)
{
  yDist = round(value / 8.0f) + 1;
}
