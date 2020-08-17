#include <stdio.h>
#include <string.h>

struct Block{
    int index;
    char timestamp[18];
    // the data here is limited to 1000 words
    char data[1000];

    // sha256 outputs 64bit
    char previousHash[64];
    char hash[64];
};

char hash(int index, char timestamp[], char data[], char previousHash[]){
    char hash[64];
    snprintf(hash, index,timestamp,data,previousHash);
    return hash;
}

void blockchain(){
    // genesis block
    struct Block block;
    block.index = 0;
    strcpy(block.timestamp, "2001/07/26-09:00PM");
    strcpy(block.data, "Genesis Block");
    strcpy(block.previousHash, "0");
    strcpy(block.hash, hash(0, "2001/07/26-09:00PM", "Genesis Block", "0"));

    printf(block.hash);
}
