pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/sowmithra05/fitness-devops-project.git'
            }
        }

        stage('Check Docker') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Build Backend') {
            steps {
                sh 'docker build -t fitness-backend ./backend'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker build -t fitness-frontend ./frontend'
            }
        }
    }
}